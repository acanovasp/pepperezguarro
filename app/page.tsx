import { getProjects } from '@/lib/data';
import HomeSlider from '@/components/sliders/HomeSlider';

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main>
      <HomeSlider projects={projects} />
    </main>
  );
}
