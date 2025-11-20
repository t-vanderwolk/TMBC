import { notFound } from 'next/navigation';

import ModuleLayoutEditorial from '@/components/academy/ModuleLayoutEditorial';
import WorkbookEditorial from '@/components/workbook/WorkbookEditorial';
import ApplyPanelEditorial from '@/components/academy/ApplyPanelEditorial';
import RecommendationBoard from '@/components/academy/RecommendationBoard';
import MentorNotesEditorial from '@/components/academy/MentorNotesEditorial';
import { academyModules, findModuleById } from '../modules';

type ModulePageProps = {
  params: {
    moduleId: string;
  };
};

const ModulePage = ({ params }: ModulePageProps) => {
  const module = findModuleById(params.moduleId) ?? notFound();

  return (
    <ModuleLayoutEditorial module={module}>
      <WorkbookEditorial module={module} />
      <ApplyPanelEditorial module={module} />
      <RecommendationBoard moduleId={module.id} />
      <MentorNotesEditorial module={module} />
    </ModuleLayoutEditorial>
  );
};

export const generateStaticParams = () =>
  academyModules.map((module) => ({ moduleId: module.id }));

export default ModulePage;
