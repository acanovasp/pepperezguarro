import { getProjectBySlug, getAllProjectSlugs } from '@/lib/data';
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

  return (
    <main>
      <ProjectPageClient project={project} />
    </main>
  );
}

