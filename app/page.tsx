import { getProjects } from '@/lib/data';
import HomePageClient from './HomePageClient';

export default async function HomePage() {
  const projects = await getProjects();

  return <HomePageClient projects={projects} />;
}
