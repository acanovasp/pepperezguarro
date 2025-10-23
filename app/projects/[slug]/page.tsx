import { getProjectBySlug, getProjects } from '@/lib/data';
import ProjectPageClient from '@/app/projects/[slug]/ProjectPageClient';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const projects = await getProjects();

  if (!project) {
    return <div>Project not found</div>;
  }

  // Find project number (index + 1)
  const projectNumber = projects.findIndex(p => p.id === project.id) + 1;

  return (
    <main>
      <ProjectPageClient project={project} projectNumber={projectNumber} />
    </main>
  );
}

