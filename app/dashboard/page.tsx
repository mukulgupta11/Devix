import { Activity, Clock3, FolderKanban, Sparkles } from "lucide-react";
import AddNewButton from "@/features/dashboard/components/add-new-btn";
import AddRepo from "@/features/dashboard/components/add-repo";
import ProjectTable from "@/features/dashboard/components/project-table";
import DashboardMotionShell from "@/features/dashboard/components/dashboard-motion-shell";
import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getAllPlaygroundForUser,
} from "@/features/playground/actions";

const EmptyState = () => (
  <div className="relative flex min-h-80 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-card/50 px-6 text-center">
    <div className="dvx-grid pointer-events-none absolute inset-0 opacity-35" />
    <div className="relative grid size-14 place-items-center rounded-2xl border border-border bg-background text-primary">
      <FolderKanban className="size-6" />
    </div>
    <h2 className="relative mt-5 font-headline text-2xl font-normal tracking-[-0.04em]">
      Your workspace is wide open.
    </h2>
    <p className="relative mt-2 max-w-md text-sm leading-6 text-muted-foreground">
      Start from a production-ready template or mount an existing GitHub
      repository. Your runtime will be ready in the playground.
    </p>
  </div>
);

const DashboardMainPage = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  const projectCount = playgrounds?.length ?? 0;
  const starredCount =
    playgrounds?.filter((project) => project.Starmark?.[0]?.isMarked).length ?? 0;
  const latestProject = playgrounds?.[0];

  return (
    <DashboardMotionShell>
      <div className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-10 sm:px-8 lg:px-10">
        <header className="grid gap-7 border-b border-border pb-9 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              <p className="dvx-kicker">Command center</p>
            </div>
            <h1 className="mt-4 font-headline text-4xl font-normal leading-none tracking-[-0.055em] sm:text-5xl">
              Good to see you.
              <span className="block text-muted-foreground">
                What are we building?
              </span>
            </h1>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card">
            <div className="min-w-24 border-r border-border p-4 sm:min-w-32">
              <FolderKanban className="mb-3 size-4 text-muted-foreground" />
              <strong className="font-headline text-2xl font-medium">
                {projectCount}
              </strong>
              <p className="mt-1 text-[11px] text-muted-foreground">Projects</p>
            </div>
            <div className="min-w-24 border-r border-border p-4 sm:min-w-32">
              <Activity className="mb-3 size-4 text-muted-foreground" />
              <strong className="font-headline text-2xl font-medium">
                {starredCount}
              </strong>
              <p className="mt-1 text-[11px] text-muted-foreground">Starred</p>
            </div>
            <div className="min-w-24 p-4 sm:min-w-32">
              <Clock3 className="mb-3 size-4 text-muted-foreground" />
              <strong className="font-headline text-sm font-medium">
                {latestProject ? "Active" : "Ready"}
              </strong>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Runtime status
              </p>
            </div>
          </div>
        </header>

        <section className="py-9">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="dvx-kicker">Quick start</p>
              <h2 className="mt-2 font-headline text-xl font-medium tracking-[-0.03em]">
                Open a fresh workspace
              </h2>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
              WebContainer powered
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AddNewButton />
            <AddRepo />
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="dvx-kicker">Your work</p>
              <h2 className="mt-2 font-headline text-xl font-medium tracking-[-0.03em]">
                Recent projects
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {projectCount} total
            </span>
          </div>
          {!playgrounds || playgrounds.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectTable
              projects={playgrounds}
              onDeleteProject={deleteProjectById}
              onUpdateProject={editProjectById}
              onDuplicateProject={duplicateProjectById}
            />
          )}
        </section>
      </div>
    </DashboardMotionShell>
  );
};

export default DashboardMainPage;
