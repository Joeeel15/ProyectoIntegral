
import CatalogoMedicos from '../page';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Catálogo de médicos | MediTurno',
  description: 'Consulta el catálogo público de médicos de MediTurno.',
};

export default function PaginaMedicos() {
  return <CatalogoMedicos />;
}
