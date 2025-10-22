'use client';

import { FormEvent, useState } from 'react';
import { DateTime } from 'luxon';
import type { AvailableSlot } from '@/lib/availability';

export type BookingFormValues = {
  guestName: string;
  guestPhone: string;
};

type BookingFormProps = {
  scheduleTitle: string;
  timezone: string;
  selectedSlot: AvailableSlot | null;
  onSubmit: (values: BookingFormValues) => Promise<void>;
  loading?: boolean;
};

export function BookingForm({ scheduleTitle, timezone, selectedSlot, onSubmit, loading }: BookingFormProps) {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formattedSlot = selectedSlot
    ? (() => {
        const start = DateTime.fromISO(selectedSlot.startTs, { zone: 'utc' }).setZone(timezone);
        const end = DateTime.fromISO(selectedSlot.endTs, { zone: 'utc' }).setZone(timezone);
        return `${start.toFormat('cccc, d LLLL HH:mm')} – ${end.toFormat('HH:mm')}`;
      })()
    : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedSlot) {
      setError('Please select a time slot first');
      return;
    }

    setError(null);
    setSuccess(false);

    try {
      await onSubmit({ guestName, guestPhone });
      setSuccess(true);
      setGuestName('');
      setGuestPhone('');
    } catch (submitError: any) {
      setError(submitError?.message ?? 'Unable to complete booking');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Book {scheduleTitle}</h2>
        <p className="text-sm text-slate-500">Provide your details to confirm the meeting.</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Selected time</label>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {formattedSlot ?? 'Choose a slot on the left'}
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="guestName" className="text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="guestName"
            type="text"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="guestPhone" className="text-sm font-medium text-slate-700">
            Phone (E.164)
          </label>
          <input
            id="guestPhone"
            type="tel"
            value={guestPhone}
            onChange={(event) => setGuestPhone(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            placeholder="+972501234567"
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-violet-600">Booking confirmed! Check your phone for follow-up.</p>}

      <button
        type="submit"
        disabled={!selectedSlot || loading}
        className="inline-flex items-center justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? 'Booking...' : 'Confirm booking'}
      </button>
    </form>
  );
}

