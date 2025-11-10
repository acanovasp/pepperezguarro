import { getProjectBySlug, getAllProjectSlugs, getProjects } from '@/lib/data';
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

  if (!project) {
    return <div>Project not found</div>;
  }

  // Get all projects to determine next project slug
  const allProjects = await getProjects();
  const allSlugs = allProjects.map(p => p.slug);
  const currentIndex = allSlugs.indexOf(slug);
  const nextSlug = currentIndex !== -1 && currentIndex < allSlugs.length - 1 
    ? allSlugs[currentIndex + 1] 
    : allSlugs[0]; // Wrap to first project

  return (
    <main>
      <ProjectPageClient 
        project={project} 
        nextProjectSlug={nextSlug}
      />
    </main>
  );
}

