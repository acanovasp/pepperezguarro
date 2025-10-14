import { getProjectBySlug } from '@/lib/data';
import ProjectPageClient from '@/app/projects/[slug]/ProjectPageClient';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <main>
      <ProjectPageClient project={project} />
    </main>
  );
}

