import { getProjectBySlug, getProjects, getAllProjectSlugs } from '@/lib/data';
import ProjectPageClient from '@/app/projects/[slug]/ProjectPageClient';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Enable ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Generate static paths for all projects at build time
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
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

