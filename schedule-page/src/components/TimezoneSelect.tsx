interface TimezoneSelectProps {
  value: string
  defaultZone: string
  onChange: (tz: string) => void
}

const COMMON_ZONES = [
  'Europe/Berlin',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Singapore',
  'Australia/Sydney'
]

export default function TimezoneSelect({ value, onChange, defaultZone }: TimezoneSelectProps) {
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const options = Array.from(new Set([value, localZone, defaultZone, ...COMMON_ZONES].filter(Boolean))) as string[]

  return (
    <label className="text-sm text-slate-600 flex items-center gap-2">
      Timezone
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        {options.map((tz) => (
          <option value={tz} key={tz}>
            {tz}
          </option>
        ))}
      </select>
    </label>
  )
}
