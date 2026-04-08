import { NextResponse } from 'next/server';
import { currentUser } from '@/features/auth/actions';
import { db } from '@/lib/db';
import type { TemplateFile, TemplateFolder } from '@/features/playground/types';

const MAX_FILE_SIZE = 100 * 1024; // 100 KB limit for files

const binaryExtensions = [
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'webp', 'svg',
  'pdf', 'mp3', 'mp4', 'wav', 'avi', 'mov', 'zip', 'tar', 'gz', 'rar',
  'exe', 'dll', 'so', 'dylib', 'class', 'jar', 'bin', 'ttf', 'woff', 'woff2', 'eot'
];

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { repoUrl, title, description } = await req.json();

    if (!repoUrl) {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }

    // Attempt to parse the GitHub URL
    let urlString = repoUrl;
    if (!urlString.startsWith('http')) {
      urlString = `https://${urlString}`;
    }

    const url = new URL(urlString);
    if (url.hostname !== 'github.com') {
      return NextResponse.json({ error: 'URL must be a github.com repository' }, { status: 400 });
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return NextResponse.json({ error: 'Invalid repository path in URL' }, { status: 400 });
    }

    const owner = parts[0];
    const repo = parts[1].replace('.git', '');

    // Get default branch
    const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { 'User-Agent': 'Devix-App' }
    });

    if (!repoInfoRes.ok) {
        if (repoInfoRes.status === 404) {
            return NextResponse.json({ error: 'Repository not found or is private' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to fetch repository information' }, { status: repoInfoRes.status });
    }

    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch || 'main';

    // Fetch the tree recursively
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
        headers: { 'User-Agent': 'Devix-App' }
    });

    if (!treeRes.ok) {
        return NextResponse.json({ error: 'Failed to fetch repository code tree' }, { status: treeRes.status });
    }

    const treeData = await treeRes.json();
    
    // We only want blob files (not tree or commit) and not too large, and skip binary
    const filesToFetch = treeData.tree.filter((item: any) => {
        if (item.type !== 'blob') return false;
        if (item.size > MAX_FILE_SIZE) return false;
        
        const extension = item.path.split('.').pop()?.toLowerCase();
        if (extension && binaryExtensions.includes(extension)) return false;
        
        // Skip node_modules, .git, etc.
        if (item.path.includes('node_modules/') || item.path.includes('.git/')) return false;

        return true;
    });

    // To prevent rate limiting or timeout, we limit the number of files we fetch
    if (filesToFetch.length > 300) {
        return NextResponse.json({ error: 'Repository contains too many text files (max 300)' }, { status: 400 });
    }

    const rootFolder: TemplateFolder = {
        folderName: "root",
        items: []
    };

    // Helper to insert a file into our nested TemplateFolder structure
    const insertFile = (path: string, content: string) => {
        const parts = path.split('/');
        const fileName = parts.pop() || '';
        
        // Extract extension
        const nameParts = fileName.split('.');
        const fileExtension = nameParts.length > 1 ? nameParts.pop() || '' : '';
        const filename = nameParts.join('.');

        let currentFolder = rootFolder;

        for (const part of parts) {
            let nextFolder = currentFolder.items.find(
                item => 'folderName' in item && item.folderName === part
            ) as TemplateFolder | undefined;

            if (!nextFolder) {
                nextFolder = { folderName: part, items: [] };
                currentFolder.items.push(nextFolder);
            }
            currentFolder = nextFolder;
        }

        currentFolder.items.push({
            filename,
            fileExtension,
            content
        });
    };

    // Fetch contents concurrently in batches
    const BATCH_SIZE = 10;
    for (let i = 0; i < filesToFetch.length; i += BATCH_SIZE) {
        const batch = filesToFetch.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (item: any) => {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${item.path}`;
            try {
                const res = await fetch(rawUrl);
                if (res.ok) {
                    const content = await res.text();
                    insertFile(item.path, content);
                }
            } catch (err) {
                console.error(`Failed to fetch ${rawUrl}`, err);
            }
        }));
    }

    // Create playground
    const playground = await db.playground.create({
        data: {
            title: title || repoInfo.name,
            description: description || repoInfo.description || `Imported from ${owner}/${repo}`,
            template: "REACT", // Default since we don't have an "EMPTY" or "CUSTOM"
            userId: user.id
        }
    });

    // Create template files
    await db.templateFile.create({
        data: {
            playgroundId: playground.id,
            content: JSON.stringify(rootFolder)
        }
    });

    return NextResponse.json({ success: true, playgroundId: playground.id });

  } catch (error: any) {
    console.error('GitHub import error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
