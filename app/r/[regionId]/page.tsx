import { notFound } from 'next/navigation'
import { regions } from '@/lib/world'
import { WorldMap } from '@/components/WorldMap'
export function generateStaticParams() { return regions.map((r) => ({ regionId: r.id })) }
export default async function RegionPage({ params }: { params: Promise<{ regionId: string }> }) { const { regionId } = await params; if (!regions.some((r) => r.id === regionId)) notFound(); return <main className="min-h-screen bg-background"><WorldMap regionId={regionId} /></main> }
