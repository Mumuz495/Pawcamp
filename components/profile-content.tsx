import { Bell, Cat, Dog, Ruler, Settings2 } from 'lucide-react';
import { Card, Pill } from '@/components/ui';

export function ProfileContent() {
  return (
    <div className="space-y-5 px-4 pb-6 pt-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Profile</p>
        <h1 className="mt-2 text-[38px] leading-[1.03] font-semibold">Camping preferences</h1>
        <p className="mt-2 text-sm leading-6 text-muted">A lightweight V4 preference area for future personalization, account state, and notifications.</p>
      </div>

      <Card className="bg-surface-muted">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-primary-soft p-3 text-primary"><Settings2 size={18} /></span>
          <div>
            <h2 className="text-lg font-semibold">Your default travel setup</h2>
            <p className="mt-1 text-sm leading-6 text-muted">These are placeholders now, but the structure is ready for real saved preferences.</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Pet preference</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill active><Dog size={12} className="mr-1" /> Traveling with dog</Pill>
          <Pill><Cat size={12} className="mr-1" /> Traveling with cat</Pill>
          <Pill>Both</Pill>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Preferred style</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill active>Quiet camp</Pill>
          <Pill>Beginner friendly</Pill>
          <Pill>Water nearby</Pill>
          <Pill>Signal available</Pill>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">System placeholders</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li className="flex items-center gap-2"><Bell size={15} /> Availability alerts</li>
          <li className="flex items-center gap-2"><Ruler size={15} /> Unit and distance preferences</li>
          <li className="flex items-center gap-2"><Settings2 size={15} /> Future Apple sign-in and synced favorites</li>
        </ul>
      </Card>
    </div>
  );
}
