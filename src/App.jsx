import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Gallery from "./pages/Gallery"

export const API = "https://photo-selector-backend-production-5d1d.up.railway.app"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/project/:code" element={<Gallery />} />
    </Routes>
  )
}