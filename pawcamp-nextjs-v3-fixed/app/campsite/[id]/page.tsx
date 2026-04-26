import { notFound } from 'next/navigation';
import { DetailContent } from '@/components/detail-content';
import { campsites } from '@/data/campsites';
import { getCampsiteBySlugOrId } from '@/lib/filters';

export const dynamicParams = false;

export function generateStaticParams() {
  return campsites.map((campsite) => ({ id: campsite.slug }));
}

export default async function CampsiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campsite = getCampsiteBySlugOrId(id);

  if (!campsite) notFound();

  return <DetailContent campsite={campsite} />;
}
