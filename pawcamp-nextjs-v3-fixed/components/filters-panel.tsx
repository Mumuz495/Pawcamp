'use client';

import { X } from 'lucide-react';
import { Filters } from '@/lib/types';
import { ToggleChip } from '@/components/ui';

// FIX: removed the self-contained <button>Filters</button> trigger that was
// causing a duplicate filter entry point alongside the one in DiscoverContent's
// search bar. The panel is now purely controlled from outside via open/onOpenChange.
export function FiltersPanel({
  filters,
  onChange,
  onReset,
  open,
  onOpenChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-[32px] border border-border bg-surface p-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Discover
            </p>
            <h3 className="mt-1 text-xl font-semibold">Tune your campsite match</h3>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-surface-alt p-2 text-muted"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 pb-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Search</h4>
              <button className="text-sm text-primary" onClick={onReset}>
                Reset all
              </button>
            </div>
            <input
              value={filters.query}
              onChange={(e) => onChange({ ...filters, query: e.target.value })}
              placeholder="City, place, or vibe"
              className="w-full rounded-2xl border border-border bg-surface-alt px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Pet type</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['all', 'All pets'],
                  ['dog', '🐶 Dog'],
                  ['cat', '🐱 Cat'],
                  ['both', '🐾 Both'],
                ] as const
              ).map(([value, label]) => (
                <ToggleChip
                  key={value}
                  active={filters.petType === value}
                  label={label}
                  onClick={() => onChange({ ...filters, petType: value as Filters['petType'] })}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Price</p>
            <div className="flex flex-wrap gap-2">
              {(['all', 'Free', 'Paid'] as const).map((value) => (
                <ToggleChip
                  key={value}
                  active={filters.priceType === value}
                  label={value === 'all' ? 'Any price' : value}
                  onClick={() =>
                    onChange({ ...filters, priceType: value as Filters['priceType'] })
                  }
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Features</p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['water', 'Water'],
                  ['parking', 'Parking'],
                  ['campfire', 'Campfire'],
                  ['beginnerFriendly', 'Beginner'],
                  ['quiet', 'Quiet'],
                ] as const
              ).map(([key, label]) => {
                const active = Boolean(filters[key as keyof Filters]);
                return (
                  <ToggleChip
                    key={key}
                    active={active}
                    label={label}
                    onClick={() =>
                      onChange({ ...filters, [key]: !active })
                    }
                  />
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold">Distance</span>
              <span className="text-muted">Within {filters.distanceMax} km</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={filters.distanceMax}
              onChange={(e) => onChange({ ...filters, distanceMax: Number(e.target.value) })}
              className="range-accent w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
