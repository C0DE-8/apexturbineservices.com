import { Navigate, Route, Routes } from 'react-router-dom'
import Admin from '../pages/admin/Admin.jsx'

export default function AdminRouter() {
  return <Routes>
    <Route index element={<Admin />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
}
