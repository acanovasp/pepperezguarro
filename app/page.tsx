import { getProjects } from '@/lib/data';
import HomePageClient from './HomePageClient';

// Enable ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const projects = await getProjects();

  return <HomePageClient projects={projects} />;
}
