import { notFound } from 'next/navigation';
import { DetailContent } from '@/components/detail-content';
import { getCampsiteBySlugOrId } from '@/lib/filters';

export default async function CampsiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campsite = getCampsiteBySlugOrId(id);

  if (!campsite) notFound();

  return <DetailContent campsite={campsite} />;
}
