import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../lib/supabaseClient"
import { callEdge } from "../lib/edgeClient"
import { env } from "../lib/env"
import Loader from "../components/Loader"
import ErrorMessage from "../components/ErrorMessage"
import { useSupabaseSession } from "../hooks/useSupabaseSession"
import { formatDateTime, toUtcIso } from "../lib/time"

interface ServiceRow {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  buffer_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AvailabilityRow {
  id: string
  service_id: string | null
  start_time: string
  end_time: string
  is_recurring: boolean
  recurrence_rule: string | null
  created_at: string
}

interface BookingRow {
  id: string
  service_id: string
  client_full_name: string
  client_phone: string
  status: string
  confirmation_code: string
  start_time: string
  end_time: string
}

interface ProfileRow {
  timezone: string | null
  full_name: string | null
}
function OwnerLogin({ redirectTo }: { redirectTo: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"password" | "magic">("password")
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus(null)
    setError(null)

    try {
      if (!email) {
        throw new Error("Email is required")
      }

      if (mode === "password") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (signInError) throw signInError
        setStatus("Signed in successfully")
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo
          }
        })
        if (otpError) throw otpError
        setStatus("Magic link sent. Check your email to finish signing in.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Owner Sign In</h1>
          <p className="text-sm text-slate-400">
            Enter the inbox email associated with your VENA account to unlock the scheduling dashboard.
          </p>
        </div>
        <div className="flex gap-2 rounded-lg bg-slate-800 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 rounded-md px-3 py-2 ${
              mode === "password" ? "bg-emerald-500 text-slate-900" : "text-slate-300"
            }`}
          >
            Email &amp; Password
          </button>
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`flex-1 rounded-md px-3 py-2 ${
              mode === "magic" ? "bg-emerald-500 text-slate-900" : "text-slate-300"
            }`}
          >
            Email Magic Link
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          {mode === "password" ? (
            <label className="block text-sm font-medium text-slate-300">
              Password
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-slate-900 font-semibold hover:bg-emerald-400 disabled:opacity-60"
          >
            {submitting ? "Processing..." : mode === "password" ? "Sign In" : "Send Magic Link"}
          </button>
        </form>
        {status ? <p className="text-sm text-emerald-400">{status}</p> : null}
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  )
}
export default function OwnerDashboardPage() {
  const { editToken } = useParams()
  const navigate = useNavigate()
  const { session, loading } = useSupabaseSession()
  const queryClient = useQueryClient()
  const [daysAhead, setDaysAhead] = useState(30)
  const [selectedServiceForGeneration, setSelectedServiceForGeneration] = useState<string | "all">("all")

  const redirectTo = typeof window !== "undefined" ? window.location.href : ""

  const verifyTokenQuery = useQuery({
    queryKey: ["verify-edit-token", editToken, session?.user?.id],
    enabled: Boolean(session?.user) && Boolean(editToken),
    queryFn: async () => {
      const { data, error } = await supabase.rpc("verify_edit_token", {
        p_edit_token: editToken
      })
      if (error) {
        throw new Error(error.message)
      }
      return data as string
    }
  })

  const dashboardQuery = useQuery({
    queryKey: ["owner-dashboard", session?.user?.id],
    enabled: verifyTokenQuery.isSuccess,
    queryFn: async () => {
      const [servicesRes, availabilityRes, bookingsRes, profileRes, linkRes] = await Promise.all([
        supabase.from("services").select("*").order("created_at", { ascending: true }),
        supabase.from("availability_blocks").select("*").order("start_time", { ascending: true }),
        supabase.from("bookings").select("*").order("start_time", { ascending: true }),
        supabase.from("profiles").select("full_name, timezone").maybeSingle(),
        supabase.from("links").select("public_token").maybeSingle()
      ])

      const errors = [servicesRes.error, availabilityRes.error, bookingsRes.error, profileRes.error, linkRes.error].filter(Boolean)
      if (errors.length) {
        throw new Error(errors[0]!.message)
      }

      return {
        services: (servicesRes.data ?? []) as ServiceRow[],
        availability: (availabilityRes.data ?? []) as AvailabilityRow[],
        bookings: (bookingsRes.data ?? []) as BookingRow[],
        profile: (profileRes.data ?? null) as ProfileRow | null,
        publicToken: linkRes.data?.public_token ?? null
      }
    }
  })
  const createServiceMutation = useMutation({
    mutationFn: async (payload: { name: string; description?: string; duration_minutes: number; buffer_minutes: number; is_active: boolean }) => {
      if (!session?.user) throw new Error("Not authenticated")
      const { error } = await supabase.from("services").insert({
        owner_id: session.user.id,
        name: payload.name,
        description: payload.description ?? null,
        duration_minutes: payload.duration_minutes,
        buffer_minutes: payload.buffer_minutes,
        is_active: payload.is_active
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard", session?.user?.id] })
    }
  })

  const updateServiceMutation = useMutation({
    mutationFn: async (payload: { id: string; updates: Partial<Omit<ServiceRow, "id" | "created_at" | "updated_at">> }) => {
      const { error } = await supabase
        .from("services")
        .update({
          name: payload.updates.name,
          description: payload.updates.description ?? null,
          duration_minutes: payload.updates.duration_minutes,
          buffer_minutes: payload.updates.buffer_minutes,
          is_active: payload.updates.is_active
        })
        .eq("id", payload.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard", session?.user?.id] })
    }
  })

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase.from("services").delete().eq("id", serviceId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard", session?.user?.id] })
    }
  })
  const createAvailabilityMutation = useMutation({
    mutationFn: async (payload: { start: string; end: string; serviceId: string | null }) => {
      if (!session?.user) throw new Error("Not authenticated")
      const { error } = await supabase.from("availability_blocks").insert({
        owner_id: session.user.id,
        service_id: payload.serviceId,
        start_time: toUtcIso(payload.start),
        end_time: toUtcIso(payload.end),
        is_recurring: false
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard", session?.user?.id] })
    }
  })

  const deleteAvailabilityMutation = useMutation({
    mutationFn: async (availabilityId: string) => {
      const { error } = await supabase.from("availability_blocks").delete().eq("id", availabilityId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard", session?.user?.id] })
    }
  })

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase.rpc("cancel_booking", { p_booking_id: bookingId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard", session?.user?.id] })
    }
  })

  const generateSlotsMutation = useMutation({
    mutationFn: async () => {
      if (!session?.access_token) throw new Error("Missing session token")
      return callEdge<{ result: unknown }>("/generate_slots", {
        token: session.access_token,
        body: {
          daysAhead,
          serviceId: selectedServiceForGeneration === "all" ? null : selectedServiceForGeneration
        }
      })
    }
  })

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const timezone = useMemo(() => dashboardQuery.data?.profile?.timezone ?? env.defaultTimezone, [dashboardQuery.data?.profile?.timezone])
  if (!editToken) {
    return <ErrorMessage title="Missing token" message="Provide a valid edit link token." retry={() => navigate("/")} />
  }

  if (loading) {
    return <Loader label="Checking session" />
  }

  if (!session) {
    return <OwnerLogin redirectTo={redirectTo} />
  }

  if (verifyTokenQuery.isError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <ErrorMessage
          title="Invalid edit link"
          message={verifyTokenQuery.error instanceof Error ? verifyTokenQuery.error.message : "We could not validate this edit link."}
          retry={() => queryClient.invalidateQueries({ queryKey: ["verify-edit-token", editToken, session.user.id] })}
        />
      </div>
    )
  }

  if (dashboardQuery.isLoading) {
    return <Loader label="Loading owner dashboard" />
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <ErrorMessage
          message={dashboardQuery.error instanceof Error ? dashboardQuery.error.message : "Unable to load dashboard data."}
          retry={() => queryClient.invalidateQueries({ queryKey: ["owner-dashboard", session.user.id] })}
        />
      </div>
    )
  }

  const { services, availability, bookings, publicToken } = dashboardQuery.data
  const bookingUrlBase = env.bookingBaseUrl ?? `${window.location.origin}/booking`
  const publicBookingUrl = publicToken ? `${bookingUrlBase.replace(/\/$/, "")}/${publicToken}` : null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="text-lg font-semibold">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">Timezone: {timezone}</span>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Public booking link</h2>
              {publicBookingUrl ? (
                <p className="text-sm text-slate-400 mt-1">Share this link with clients to let them book directly.</p>
              ) : (
                <p className="text-sm text-rose-300 mt-1">Generate links via the backend edge function to activate booking.</p>
              )}
            </div>
            {publicBookingUrl ? (
              <div className="flex items-center gap-3">
                <code className="truncate rounded-lg bg-slate-800 px-3 py-2 text-sm">{publicBookingUrl}</code>
                <button
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-slate-900 font-semibold hover:bg-emerald-400"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(publicBookingUrl)
                    } catch (error) {
                      console.error("Clipboard error", error)
                    }
                  }}
                >
                  Copy
                </button>
              </div>
            ) : null}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Services</h2>
          </div>
          <ServiceManager
            services={services}
            onCreate={(payload) => createServiceMutation.mutateAsync(payload)}
            onUpdate={(payload) => updateServiceMutation.mutateAsync(payload)}
            onDelete={(id) => deleteServiceMutation.mutateAsync(id)}
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Availability</h2>
          </div>
          <AvailabilityManager
            services={services}
            availability={availability}
            timezone={timezone}
            onCreate={(payload) => createAvailabilityMutation.mutateAsync(payload)}
            onDelete={(id) => deleteAvailabilityMutation.mutateAsync(id)}
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Generate bookable slots</h2>
              <p className="text-sm text-slate-400">
                Slots are created by slicing availability blocks by service duration and buffer. Existing future slots are preserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="text-sm text-slate-300">
                Days ahead
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={daysAhead}
                  onChange={(event) => setDaysAhead(Number(event.target.value))}
                  className="mt-1 w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5"
                />
              </label>
              <label className="text-sm text-slate-300">
                Service
                <select
                  value={selectedServiceForGeneration}
                  onChange={(event) => setSelectedServiceForGeneration(event.target.value as typeof selectedServiceForGeneration)}
                  className="mt-1 w-44 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5"
                >
                  <option value="all">All services</option>
                  {services.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="rounded-lg bg-emerald-500 px-4 py-2 text-slate-900 font-semibold hover:bg-emerald-400 disabled:opacity-60"
                onClick={() => generateSlotsMutation.mutateAsync()}
                disabled={generateSlotsMutation.isPending}
              >
                {generateSlotsMutation.isPending ? "Generating..." : "Generate slots"}
              </button>
            </div>
          </div>
          {generateSlotsMutation.isError ? (
            <p className="text-sm text-rose-300">
              {generateSlotsMutation.error instanceof Error
                ? generateSlotsMutation.error.message
                : "Unable to generate slots"}
            </p>
          ) : null}
          {generateSlotsMutation.isSuccess ? (
            <p className="text-sm text-emerald-300">Slots generated successfully.</p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Bookings</h2>
            <p className="text-sm text-slate-400">Confirmed bookings are locked; cancel to free the slot.</p>
          </div>
          <BookingsTable
            bookings={bookings}
            services={services}
            timezone={timezone}
            onCancel={(id) => cancelBookingMutation.mutateAsync(id)}
            cancellingId={cancelBookingMutation.variables as string | undefined}
          />
        </section>
      </main>
    </div>
  )
}
interface ServiceManagerProps {
  services: ServiceRow[]
  onCreate: (payload: { name: string; description?: string; duration_minutes: number; buffer_minutes: number; is_active: boolean }) => Promise<void>
  onUpdate: (payload: { id: string; updates: Partial<Omit<ServiceRow, "id" | "created_at" | "updated_at">> }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function ServiceManager({ services, onCreate, onUpdate, onDelete }: ServiceManagerProps) {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    duration_minutes: 30,
    buffer_minutes: 0,
    is_active: true
  })
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingState, setEditingState] = useState<Record<string, {
    name: string
    description: string
    duration_minutes: number
    buffer_minutes: number
    is_active: boolean
  }>>({})

  const resetForm = () => setFormState({ name: '', description: '', duration_minutes: 30, buffer_minutes: 0, is_active: true })

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreating(true)
    try {
      await onCreate({
        name: formState.name,
        description: formState.description || undefined,
        duration_minutes: formState.duration_minutes,
        buffer_minutes: formState.buffer_minutes,
        is_active: formState.is_active
      })
      resetForm()
    } finally {
      setCreating(false)
    }
  }

  const startEditing = (service: ServiceRow) => {
    setEditingId(service.id)
    setEditingState((prev) => ({
      ...prev,
      [service.id]: {
        name: service.name,
        description: service.description ?? '',
        duration_minutes: service.duration_minutes,
        buffer_minutes: service.buffer_minutes,
        is_active: service.is_active
      }
    }))
  }

  const updateDraft = (serviceId: string, patch: Partial<{ name: string; description: string; duration_minutes: number; buffer_minutes: number; is_active: boolean }>) => {
    setEditingState((prev) => {
      const current = prev[serviceId] ?? {
        name: '',
        description: '',
        duration_minutes: 30,
        buffer_minutes: 0,
        is_active: true
      }
      return { ...prev, [serviceId]: { ...current, ...patch } }
    })
  }

  const cancelEditing = () => setEditingId(null)

  const saveEditing = async (serviceId: string) => {
    const draft = editingState[serviceId]
    if (!draft) return
    await onUpdate({
      id: serviceId,
      updates: {
        name: draft.name,
        description: draft.description,
        duration_minutes: draft.duration_minutes,
        buffer_minutes: draft.buffer_minutes,
        is_active: draft.is_active
      }
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 lg:grid-cols-5">
        <label className="text-sm text-slate-300 lg:col-span-2">
          Name
          <input
            required
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Strategy session"
          />
        </label>
        <label className="text-sm text-slate-300">
          Duration (min)
          <input
            type="number"
            min={5}
            max={720}
            value={formState.duration_minutes}
            onChange={(event) => setFormState((prev) => ({ ...prev, duration_minutes: Number(event.target.value) }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-300">
          Buffer (min)
          <input
            type="number"
            min={0}
            max={180}
            value={formState.buffer_minutes}
            onChange={(event) => setFormState((prev) => ({ ...prev, buffer_minutes: Number(event.target.value) }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={formState.is_active}
            onChange={(event) => setFormState((prev) => ({ ...prev, is_active: event.target.checked }))}
          />
          Active
        </label>
        <label className="text-sm text-slate-300 lg:col-span-5">
          Description (optional)
          <textarea
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Add extra context for clients"
          />
        </label>
        <div className="lg:col-span-5">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-slate-900 font-semibold hover:bg-emerald-400 disabled:opacity-60"
          >
            {creating ? 'Saving...' : 'Add service'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-sm text-slate-400">No services yet. Add one to start generating slots.</p>
        ) : (
          services.map((service) => {
            const isEditing = editingId === service.id
            const draft = isEditing
              ? editingState[service.id] ?? {
                  name: service.name,
                  description: service.description ?? '',
                  duration_minutes: service.duration_minutes,
                  buffer_minutes: service.buffer_minutes,
                  is_active: service.is_active
                }
              : null

            return (
              <div key={service.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    {isEditing && draft ? (
                      <div className="space-y-2">
                        <input
                          value={draft.name}
                          onChange={(event) => updateDraft(service.id, { name: event.target.value })}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                        />
                        <textarea
                          value={draft.description}
                          onChange={(event) => updateDraft(service.id, { description: event.target.value })}
                          rows={2}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                        />
                        <div className="flex gap-4">
                          <label className="text-sm text-slate-300">
                            Duration
                            <input
                              type="number"
                              min={5}
                              max={720}
                              value={draft.duration_minutes}
                              onChange={(event) => updateDraft(service.id, { duration_minutes: Number(event.target.value) })}
                              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                            />
                          </label>
                          <label className="text-sm text-slate-300">
                            Buffer
                            <input
                              type="number"
                              min={0}
                              max={180}
                              value={draft.buffer_minutes}
                              onChange={(event) => updateDraft(service.id, { buffer_minutes: Number(event.target.value) })}
                              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
                            />
                          </label>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={draft.is_active}
                            onChange={(event) => updateDraft(service.id, { is_active: event.target.checked })}
                          />
                          Active
                        </label>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        {service.description ? (
                          <p className="text-sm text-slate-400 mt-1">{service.description}</p>
                        ) : null}
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                          <span>{service.duration_minutes} min</span>
                          <span>Buffer {service.buffer_minutes} min</span>
                          <span className={service.is_active ? 'text-emerald-300' : 'text-rose-300'}>
                            {service.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isEditing && draft ? (
                      <>
                        <button onClick={cancelEditing} className="rounded-lg border border-slate-700 px-3 py-2 text-sm">
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEditing(service.id)}
                          className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(service)}
                          className="rounded-lg border border-slate-700 px-3 py-2 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this service? Existing bookings stay intact.')) {
                              onDelete(service.id)
                            }
                          }}
                          className="rounded-lg border border-rose-500 px-3 py-2 text-sm text-rose-300"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

interface AvailabilityManagerProps {
  services: ServiceRow[]
  availability: AvailabilityRow[]
  timezone: string
  onCreate: (payload: { start: string; end: string; serviceId: string | null }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function AvailabilityManager({ services, availability, timezone, onCreate, onDelete }: AvailabilityManagerProps) {
  const [formState, setFormState] = useState({ start: "", end: "", serviceId: "all" })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.start || !formState.end) return
    setSubmitting(true)
    try {
      await onCreate({
        start: formState.start,
        end: formState.end,
        serviceId: formState.serviceId === "all" ? null : formState.serviceId
      })
      setFormState({ start: "", end: "", serviceId: "all" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4 lg:grid-cols-4">
        <label className="text-sm text-slate-300">
          Start (local)
          <input
            type="datetime-local"
            value={formState.start}
            onChange={(event) => setFormState((prev) => ({ ...prev, start: event.target.value }))}
            onChange={(event) => setFormState((prev) => ({ ...prev, start: event.target.value }))}
            required
          />
        </label>
        <label className="text-sm text-slate-300">
          End (local)
          <input
            type="datetime-local"
            value={formState.end}
            onChange={(event) => setFormState((prev) => ({ ...prev, end: event.target.value }))}
            onChange={(event) => setFormState((prev) => ({ ...prev, end: event.target.value }))}
            required
          />
        </label>
        <label className="text-sm text-slate-300">
          Service scope
          <select
            value={formState.serviceId}
            onChange={(event) => setFormState((prev) => ({ ...prev, serviceId: event.target.value }))}
            onChange={(event) => setFormState((prev) => ({ ...prev, serviceId: event.target.value }))}
          >
            <option value="all">All services</option>
            {services.map((service) => (
              <option value={service.id} key={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-slate-900 font-semibold hover:bg-emerald-400 disabled:opacity-60"
          >
            {submitting ? "Saving" : "Add availability"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {availability.length === 0 ? (
          <p className="text-sm text-slate-400">No availability configured yet.</p>
        ) : (
          availability.map((slot) => {
            const service = services.find((s) => s.id === slot.service_id)
            return (
              <div key={slot.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-300">{service ? service.name : "All services"}</p>
                  <p className="text-base font-semibold">
                    {formatDateTime(slot.start_time, timezone, { dateStyle: 'medium', timeStyle: 'short' })} ? {" "}
                    {formatDateTime(slot.end_time, timezone, { timeStyle: 'short' })}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(slot.id)}
                  className="self-start rounded-lg border border-rose-500 px-3 py-2 text-sm text-rose-300"
                >
                  Remove
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
interface BookingsTableProps {
  bookings: BookingRow[]
  services: ServiceRow[]
  timezone: string
  onCancel: (id: string) => Promise<void>
  cancellingId?: string
}

function BookingsTable({ bookings, services, timezone, onCancel, cancellingId }: BookingsTableProps) {
  if (bookings.length === 0) {
    return <p className="text-sm text-slate-400">No bookings yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-800">
        <thead>
          <tr className="text-left text-sm text-slate-400">
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Service</th>
            <th className="px-4 py-2">Schedule</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {bookings.map((booking) => {
            const service = services.find((s) => s.id === booking.service_id)
            const isCancelled = booking.status !== "confirmed"
            return (
              <tr key={booking.id} className="text-sm text-slate-200">
                <td className="px-4 py-3">
                  <div className="font-medium">{booking.client_full_name}</div>
                  <div className="text-xs text-slate-400">{booking.confirmation_code}</div>
                </td>
                <td className="px-4 py-3">{service?.name ?? "Service"}</td>
                <td className="px-4 py-3">
                  {formatDateTime(booking.start_time, timezone)} ? {formatDateTime(booking.end_time, timezone, { timeStyle: 'short' })}
                </td>
                <td className="px-4 py-3">{booking.client_phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      isCancelled ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {!isCancelled ? (
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="rounded-lg border border-rose-500 px-3 py-1.5 text-xs text-rose-300"
                      disabled={cancellingId === booking.id}
                    >
                      {cancellingId === booking.id ? "Cancelling" : "Cancel"}
                    </button>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}



