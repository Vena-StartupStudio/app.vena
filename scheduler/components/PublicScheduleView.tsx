'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { BookingForm } from '@/components/BookingForm';
import { SlotList } from '@/components/SlotList';
import type { AvailableSlot } from '@/lib/availability';
import { useBookingRealtime } from '@/hooks/useBookingRealtime';

const RANGE_DAYS = 21;

type ScheduleMeta = {
  id: string;
  slug: string;
  title: string;
  timezone: string;
};

type AvailabilityResponse = {
  ok: boolean;
  schedule: ScheduleMeta;
  slots: AvailableSlot[];
};

type BookingResponse = {
  ok: boolean;
  code?: string;
  booking?: {
    id: string;
  };
};

export function PublicScheduleView({ slug }: { slug: string }) {
  const [schedule, setSchedule] = useState<ScheduleMeta | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fromIso, toIso } = useMemo(() => {
    const from = DateTime.utc().startOf('day');
    const to = from.plus({ days: RANGE_DAYS }).endOf('day');
    return {
      fromIso: from.toISO(),
      toIso: to.toISO()
    };
  }, []);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/scheduler/${encodeURIComponent(slug)}/availability?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`
      );
      if (!response.ok) {
        throw new Error('Failed to load availability');
      }
      const data = (await response.json()) as AvailabilityResponse;
      if (!data.ok) {
        throw new Error('Scheduler unavailable');
      }
      setSchedule(data.schedule);
      setSlots(data.slots);
      if (selectedSlot) {
        const stillPresent = data.slots.find(
          (slot) => slot.startTs === selectedSlot.startTs && slot.endTs === selectedSlot.endTs
        );
        if (!stillPresent) {
          setSelectedSlot(null);
        }
      }
    } catch (availabilityError: any) {
      setError(availabilityError?.message ?? 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, [slug, fromIso, toIso, selectedSlot]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  useBookingRealtime(schedule?.id, loadAvailability);

  const handleBooking = useCallback(async ({ guestName, guestPhone }: { guestName: string; guestPhone: string }) => {
    if (!selectedSlot) {
      throw new Error('Select a slot first');
    }
    setBooking(true);
    try {
      const response = await fetch(`/api/scheduler/${encodeURIComponent(slug)}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTs: selectedSlot.startTs,
          endTs: selectedSlot.endTs,
          guestName,
          guestPhone
        })
      });

      const data = (await response.json()) as BookingResponse;

      if (!response.ok) {
        if (data.code === 'SLOT_TAKEN') {
          throw new Error('That slot was just taken. Pick another one.');
        }
        throw new Error(data.code ?? 'Could not book slot');
      }

      await loadAvailability();
      setSelectedSlot(null);
    } finally {
      setBooking(false);
    }
  }, [slug, selectedSlot, loadAvailability]);

  if (loading && !schedule) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="animate-pulse rounded-lg bg-slate-200/60 p-10 text-slate-500">Loading availability…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </main>
    );
  }

  if (!schedule) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img src="/vena_logo.png" alt="Vena Logo" className="h-8 w-auto" />
          <span className="text-sm uppercase tracking-wide text-violet-600">Scheduler</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{schedule.title}</h1>
        <p className="text-sm text-slate-500">Times shown in {schedule.timezone}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-4">
          {loading && <p className="text-sm text-slate-500">Refreshing availability…</p>}
          <SlotList
            slots={slots}
            timezone={schedule.timezone}
            selected={selectedSlot}
            onSelect={setSelectedSlot}
          />
        </div>
        <BookingForm
          scheduleTitle={schedule.title}
          timezone={schedule.timezone}
          selectedSlot={selectedSlot}
          onSubmit={handleBooking}
          loading={booking}
        />
      </section>
    </main>
  );
}
