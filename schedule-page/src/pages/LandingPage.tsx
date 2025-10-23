import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">VENA Scheduling</h1>
        <p className="text-lg text-slate-300">
          Share your public booking link with clients or open your private owner dashboard using the
          edit link generated from the Render edge function.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/booking/demo"
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 font-medium hover:bg-emerald-400"
          >
            Booking Demo
          </Link>
          <Link
            to="/owner/demo"
            className="px-4 py-2 rounded-lg border border-slate-500 font-medium hover:border-slate-300"
          >
            Owner Dashboard Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
