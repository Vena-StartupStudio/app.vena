import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import PublicBookingPage from "./pages/PublicBookingPage"
import OwnerDashboardPage from "./pages/OwnerDashboardPage"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/booking/:publicToken" element={<PublicBookingPage />} />
      <Route path="/owner/:editToken/*" element={<OwnerDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
