import AddNewButton from "@/features/dashboard/components/add-new-btn";
import AddRepo from "@/features/dashboard/components/add-repo";

import ProjectTable from "@/features/dashboard/components/project-table";
import { getAllPlaygroundForUser , deleteProjectById ,editProjectById , duplicateProjectById} from "@/features/playground/actions";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 opacity-70">
    <img src="/empty-state.svg" alt="No projects" className="w-48 h-48 mb-6 drop-shadow-md grayscale" />
    <h2 className="text-2xl font-bold font-headline text-foreground mb-2">Workspace Empty</h2>
    <p className="text-muted-foreground font-body mb-6 text-center max-w-sm">
      Ignite your first environment. Create a new playground to mount WebContainers instantly.
    </p>
  </div>
);

const DashboardMainPage = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  console.log(playgrounds);
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepo />
      </div>
      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <ProjectTable
            // @ts-expect-error Typescript incorrectly flagging prisma structural returns against primitive Project interface
            projects={playgrounds || []}
            onDeleteProject={deleteProjectById}
            onUpdateProject={editProjectById}
            onDuplicateProject={duplicateProjectById}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardMainPage;
