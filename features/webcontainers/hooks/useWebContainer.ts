import { useState, useEffect, useCallback, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';
import { TemplateFolder } from '@/features/playground/libs/path-to-json';

interface UseWebContainerProps {
  templateData: TemplateFolder;
  projectId?: string; // Project ID to scope the WebContainer lifecycle
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

// Module-level singleton — will be nullified on project switch
let webcontainerInstancePromise: Promise<WebContainer> | null = null;
let currentWebcontainerInstance: WebContainer | null = null;

/**
 * Fully tears down the current WebContainer and clears the singleton
 * so the next boot() call creates a fresh instance.
 */
const teardownGlobalInstance = () => {
  if (currentWebcontainerInstance) {
    try {
      currentWebcontainerInstance.teardown();
    } catch (e) {
      console.warn('WebContainer teardown error (safe to ignore):', e);
    }
    currentWebcontainerInstance = null;
  }
  webcontainerInstancePromise = null;
};

export const bootWebContainer = () => {
  if (!webcontainerInstancePromise) {
    webcontainerInstancePromise = WebContainer.boot().then((instance) => {
      currentWebcontainerInstance = instance;
      return instance;
    });
  }
  return webcontainerInstancePromise;
};

export const useWebContainer = ({ templateData, projectId }: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  // Track the previous project ID to detect switches
  const prevProjectId = useRef<string | undefined>(projectId);

  useEffect(() => {
    let mounted = true;

    async function initializeWebContainer() {
      try {
        // If the project ID changed, tear down the old instance first
        if (prevProjectId.current !== projectId && prevProjectId.current !== undefined) {
          console.log(`[WebContainer] Project switched: ${prevProjectId.current} → ${projectId}. Tearing down old instance.`);
          teardownGlobalInstance();
          
          // Reset state for the new project
          if (mounted) {
            setInstance(null);
            setServerUrl(null);
            setError(null);
            setIsLoading(true);
          }
        }
        prevProjectId.current = projectId;

        const webcontainerInstance = await bootWebContainer();
        
        if (!mounted) return;
        
        setInstance(webcontainerInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize WebContainer:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize WebContainer');
          setIsLoading(false);
        }
      }
    }

    initializeWebContainer();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  // Teardown when the component fully unmounts (e.g., navigating away from playground)
  useEffect(() => {
    return () => {
      teardownGlobalInstance();
    };
  }, []);

  const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
    if (!instance) {
      throw new Error('WebContainer instance is not available');
    }

    try {
      // Ensure the folder structure exists
      const pathParts = path.split('/');
      const folderPath = pathParts.slice(0, -1).join('/');

      if (folderPath) {
        await instance.fs.mkdir(folderPath, { recursive: true });
      }

      // Write the file
      await instance.fs.writeFile(path, content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to write file';
      console.error(`Failed to write file at ${path}:`, err);
      throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
    }
  }, [instance]);

  const destroy = useCallback(() => {
    teardownGlobalInstance();
    setInstance(null);
    setServerUrl(null);
  }, []);

  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};