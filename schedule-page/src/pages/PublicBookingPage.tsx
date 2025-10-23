import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPublicSupabaseClient } from "../lib/supabaseClient"
import { env } from "../lib/env"
import { callEdge } from "../lib/edgeClient"
import { groupSlotsByDate, formatDate, formatTime } from "../lib/time"
import Loader from "../components/Loader"
import ErrorMessage from "../components/ErrorMessage"
import TimezoneSelect from "../components/TimezoneSelect"

interface ServiceRow {
  public_token: string
  service_id: string
  name: string
  description: string | null
  duration_minutes: number
  buffer_minutes: number
}

interface SlotRow {
  public_token: string
  service_id: string
  slot_id: string
  start_time: string
  end_time: string
}

interface BookingResponse {
  bookingId: string
  serviceId: string
  slotId: string
  status: string
  startTimeUtc: string
  endTimeUtc: string
  confirmationCode: string
  idempotencyKey: string
}
export default function PublicBookingPage() {
  const { publicToken } = useParams<{ publicToken: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotRow | null>(null)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("+49")
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const defaultZone = env.defaultTimezone
  const localZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])
  const [timeZone, setTimeZone] = useState(defaultZone)

  useEffect(() => {
    if (localZone) setTimeZone(localZone)
  }, [localZone])

  const publicClient = useMemo(() => {
    if (!publicToken) return null
    return createPublicSupabaseClient(publicToken)
  }, [publicToken])

  const servicesQuery = useQuery({
    queryKey: ["public-services", publicToken],
    enabled: Boolean(publicClient && publicToken),
    queryFn: async () => {
      if (!publicClient || !publicToken) throw new Error("Missing booking link")
      const { data, error } = await publicClient
        .from("public_services_view")
        .select("public_token, service_id, name, description, duration_minutes, buffer_minutes")
        .eq("public_token", publicToken)
        .order("name", { ascending: true })
      if (error) throw error
      return (data ?? []) as ServiceRow[]
    }
  })

  const slotsQuery = useQuery({
    queryKey: ["public-slots", publicToken, selectedServiceId],
    enabled: Boolean(publicClient && publicToken && selectedServiceId),
    queryFn: async () => {
      if (!publicClient || !publicToken || !selectedServiceId) return []
      const { data, error } = await publicClient
        .from("public_free_slots_view")
        .select("public_token, service_id, slot_id, start_time, end_time")
        .eq("public_token", publicToken)
        .eq("service_id", selectedServiceId)
        .order("start_time", { ascending: true })
      if (error) throw error
      return (data ?? []) as SlotRow[]
    }
  })

  useEffect(() => {
    if (servicesQuery.data && servicesQuery.data.length > 0 && !selectedServiceId) {
      setSelectedServiceId(servicesQuery.data[0]!.service_id)
    }
  }, [servicesQuery.data, selectedServiceId])

  useEffect(() => {
    setSelectedSlot(null)
  }, [selectedServiceId])
  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!publicToken || !selectedServiceId || !selectedSlot) throw new Error("Missing booking details")
      const idempotencyKey = crypto.randomUUID()
      const response = await callEdge<BookingResponse>("/public_book", {
        body: {
          publicToken,
          serviceId: selectedServiceId,
          slotId: selectedSlot.slot_id,
          fullName,
          phone,
          idempotencyKey
        },
        headers: {
          "Idempotency-Key": idempotencyKey
        }
      })
      return response
    },
    onSuccess: (data) => {
      setConfirmation(data)
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ["public-slots", publicToken, selectedServiceId] })
    },
    onError: (error) => {
      setConfirmation(null)
      setErrorMessage(error instanceof Error ? error.message : "Unable to confirm booking")
    }
  })

  if (!publicToken) {
    return <ErrorMessage title="Missing link" message="A public booking token is required." retry={() => navigate("/")} />
  }

  if (servicesQuery.isLoading) {
    return <Loader label="Loading services" />
  }

  if (servicesQuery.isError) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <ErrorMessage
          message={servicesQuery.error instanceof Error ? servicesQuery.error.message : "Unable to load services."}
          retry={() => queryClient.invalidateQueries({ queryKey: ["public-services", publicToken] })}
        />
      </div>
    )
  }

  const services = servicesQuery.data ?? []

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <ErrorMessage
          title="No services"
          message="The owner has no active services for this booking link."
          retry={() => queryClient.invalidateQueries({ queryKey: ["public-services", publicToken] })}
        />
      </div>
    )
  }

  const slotGroups = groupSlotsByDate(slotsQuery.data ?? [], timeZone)
  const selectedService = services.find((service) => service.service_id === selectedServiceId)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedSlot || !selectedService) {
      setErrorMessage("Choose a service and timeslot before booking")
      return
    }
    if (!/^\+[1-9][0-9]{4,14}$/.test(phone.trim())) {
      setErrorMessage("Phone must be in E.164 format")
      return
    }
    bookingMutation.mutate()
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-emerald-300">Book with VENA</p>
              <h1 className="text-3xl font-semibold">Pick a service and timeslot</h1>
              {selectedService ? (
                <p className="mt-2 text-sm text-slate-400">
                  {selectedService.duration_minutes} minutes • buffer {selectedService.buffer_minutes} minutes
                </p>
              ) : null}
            </div>
            <TimezoneSelect value={timeZone} defaultZone={defaultZone} onChange={setTimeZone} />
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Services</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.service_id}
                  onClick={() => setSelectedServiceId(service.service_id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    service.service_id === selectedServiceId
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{service.name}</span>
                    <span className="text-sm text-slate-400">{service.duration_minutes} min</span>
                  </div>
                  {service.description ? (
                    <p className="mt-2 text-sm text-slate-300">{service.description}</p>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available slots</h2>
              <p className="text-sm text-slate-400">Times displayed in {timeZone}</p>
            </div>
            {slotsQuery.isLoading ? (
              <Loader label="Loading availability" />
            ) : (slotsQuery.data?.length ?? 0) === 0 ? (
              <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
                No open slots for this service. Please check back soon.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(slotGroups).map(([dateKey, slots]) => (
                  <div key={dateKey} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <h3 className="text-sm font-semibold text-slate-300">{formatDate(slots[0]!.start_time, timeZone)}</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot?.slot_id === slot.slot_id
                        return (
                          <button
                            key={slot.slot_id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-lg border px-3 py-2 text-sm transition ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                                : "border-slate-700 bg-slate-900 hover:border-emerald-500/80"
                            }`}
                          >
                            {formatTime(slot.start_time, timeZone)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-xl font-semibold">Your details</h2>
              <label className="text-sm text-slate-300">
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  placeholder="Jane Doe"
                />
              </label>
              <label className="text-sm text-slate-300">
                Phone (E.164)
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  placeholder="+49123456789"
                />
              </label>
              {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
              {bookingMutation.isSuccess && confirmation ? (
                <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                  <p className="font-semibold">Booking confirmed!</p>
                  <p className="mt-1">Confirmation code: {confirmation.confirmationCode}</p>
                  <p className="mt-1">
                    {formatDate(confirmation.startTimeUtc, timeZone)} at {formatTime(confirmation.startTimeUtc, timeZone)} - {formatTime(confirmation.endTimeUtc, timeZone)}
                  </p>
                </div>
              ) : null}
              <button
                type="submit"
                disabled={bookingMutation.isPending}
                className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-slate-900 font-semibold hover:bg-emerald-400 disabled:opacity-60"
              >
                {bookingMutation.isPending ? "Booking..." : "Confirm booking"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}


