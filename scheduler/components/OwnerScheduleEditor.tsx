"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { minutesToTimeString, timeStringToMinutes } from "@/utils/time";

const WEEKDAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" }
];

const SLOT_OPTIONS = [15, 20, 30, 45, 60];

type ScheduleSettings = {
  id: string;
  slug: string;
  title: string;
  timezone: string;
  editToken: string;
};

type EditableWindow = {
  id?: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
  slotMinutes: number;
};

type SettingsResponse = {
  ok: boolean;
  schedule: ScheduleSettings;
};

type WindowsResponse = {
  ok: boolean;
  windows: Array<{
    id: string;
    weekday: number;
    start_minute: number;
    end_minute: number;
    slot_minutes: number;
  }>;
};

export function OwnerScheduleEditor({ slug, token }: { slug: string; token?: string }) {
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);
  const [windows, setWindows] = useState<EditableWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publicUrl = settings ? `${window.location.origin}/s/${settings.slug}` : "";
  const editUrl = settings && token ? `${window.location.origin}/s/${settings.slug}/edit?token=${token}` : null;

  const fetchSettings = useCallback(async () => {
    if (!token) {
      setError("No edit token provided");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/scheduler/${slug}/settings?token=${token}`);
      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error("Failed to load settings");
      }

      setSettings(data.schedule);
    } catch (err: any) {
      setError(err?.message ?? "Unable to load settings");
    }
  }, [slug, token]);

  const fetchWindows = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`/api/scheduler/${slug}/windows?token=${token}`);
      const data: WindowsResponse = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error("Failed to load windows");
      }

      setWindows(
        data.windows.map((w) => ({
          id: w.id,
          weekday: w.weekday,
          startMinute: w.start_minute,
          endMinute: w.end_minute,
          slotMinutes: w.slot_minutes
        }))
      );
    } catch (err: any) {
      setError(err?.message ?? "Unable to load availability windows");
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    fetchSettings();
    fetchWindows();
  }, [fetchSettings, fetchWindows]);

  const updateSetting = (field: keyof ScheduleSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const saveSettings = async () => {
    if (!settings || !token) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/scheduler/${slug}/settings?token=${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: settings.title,
          timezone: settings.timezone
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to save settings");
      }

      setMessage("Settings saved successfully");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err?.message ?? "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  const addWindow = () => {
    setWindows([
      ...windows,
      {
        weekday: 1,
        startMinute: 9 * 60,
        endMinute: 17 * 60,
        slotMinutes: 30
      }
    ]);
  };

  const updateWindow = (index: number, field: keyof EditableWindow, value: number) => {
    const updated = [...windows];
    updated[index] = { ...updated[index], [field]: value };
    setWindows(updated);
  };

  const removeWindow = (index: number) => {
    setWindows(windows.filter((_, i) => i !== index));
  };

  const saveWindows = async () => {
    if (!token) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/scheduler/${slug}/windows?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          windows: windows.map((w) => ({
            weekday: w.weekday,
            start_minute: w.startMinute,
            end_minute: w.endMinute,
            slot_minutes: w.slotMinutes
          }))
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to save windows");
      }

      setMessage("Availability windows saved");
      setTimeout(() => setMessage(null), 3000);
      await fetchWindows();
    } catch (err: any) {
      setError(err?.message ?? "Unable to save availability windows");
    } finally {
      setSaving(false);
    }
  };

  const sortedWindows = useMemo(() => {
    return [...windows].sort((a, b) => {
      if (a.weekday !== b.weekday) return a.weekday - b.weekday;
      return a.startMinute - b.startMinute;
    });
  }, [windows]);

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-16">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  if (error && !settings) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </main>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img src="/vena_logo.png" alt="Vena Logo" className="h-8 w-auto" />
          <span className="text-sm uppercase tracking-wide text-violet-600">Owner Editor</span>
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">{settings.title}</h1>
        <div className="flex flex-col gap-1 text-sm text-slate-500">
          <span>
            Public link: <a href={publicUrl} className="font-medium text-violet-600 hover:underline">{publicUrl}</a>
          </span>
          {editUrl && (
            <span>
              Edit link: <a href={editUrl} className="font-medium text-violet-600 hover:underline">{editUrl}</a>
            </span>
          )}
        </div>
      </header>

      {message && (
        <div className="rounded-md border border-violet-200 bg-violet-50 p-3 text-sm text-violet-700">
          {message}
        </div>
      )}

      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Schedule details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Title</span>
            <input
              type="text"
              value={settings.title}
              onChange={(event) => updateSetting("title", event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Timezone</span>
            <input
              type="text"
              value={settings.timezone}
              onChange={(event) => updateSetting("timezone", event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? "Saving..." : "Save details"}
          </button>
          <button
            type="button"
            onClick={() => {
              fetchSettings();
              setMessage(null);
              setError(null);
            }}
            className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-violet-400 hover:text-violet-600"
          >
            Cancel
          </button>
        </div>
      </section>

      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Availability windows</h2>
          <button
            type="button"
            onClick={addWindow}
            className="inline-flex items-center rounded-md border border-violet-500 px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50"
          >
            + Add window
          </button>
        </div>

        <div className="grid gap-4">
          {sortedWindows.map((window, index) => {
            const actualIndex = windows.findIndex(
              (w) => w === sortedWindows[index]
            );

            return (
              <div
                key={actualIndex}
                className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[auto,1fr,1fr,1fr,auto]"
              >
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-slate-700">Day</span>
                  <select
                    value={window.weekday}
                    onChange={(event) => updateWindow(actualIndex, "weekday", Number(event.target.value))}
                    className="rounded-md border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  >
                    {WEEKDAYS.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-slate-700">Start</span>
                  <input
                    type="time"
                    value={minutesToTimeString(window.startMinute)}
                    onChange={(event) => updateWindow(actualIndex, "startMinute", timeStringToMinutes(event.target.value))}
                    className="rounded-md border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-slate-700">End</span>
                  <input
                    type="time"
                    value={minutesToTimeString(window.endMinute)}
                    onChange={(event) => updateWindow(actualIndex, "endMinute", timeStringToMinutes(event.target.value))}
                    className="rounded-md border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-slate-700">Slot (min)</span>
                  <select
                    value={window.slotMinutes}
                    onChange={(event) => updateWindow(actualIndex, "slotMinutes", Number(event.target.value))}
                    className="rounded-md border border-slate-300 px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  >
                    {SLOT_OPTIONS.map((minutes) => (
                      <option key={minutes} value={minutes}>
                        {minutes}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeWindow(actualIndex)}
                    className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {sortedWindows.length === 0 && (
            <p className="text-center text-sm text-slate-500">
              No availability windows defined. Add one to get started.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={saveWindows}
          disabled={saving}
          className="self-start rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {saving ? "Saving..." : "Save availability"}
        </button>
      </section>
    </main>
  );
}
