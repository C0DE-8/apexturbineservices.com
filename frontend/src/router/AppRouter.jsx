import Home from '../pages/home/Home.jsx'
import NotFound from '../pages/not-found/NotFound.jsx'
import AdminRouter from './AdminRouter.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function AppRouter() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin/*" element={<AdminRouter />} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
}
