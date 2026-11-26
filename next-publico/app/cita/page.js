import { redirect } from 'next/navigation';

export default async function BuscarCita({ searchParams }) {
  const { codigo } = await searchParams;

  if (!codigo || !codigo.trim()) {
    redirect('/consultar-cita');
  }

  redirect(`/cita/${encodeURIComponent(codigo.trim())}`);
}
