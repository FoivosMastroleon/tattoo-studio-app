import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import GalleryPage from '@/pages/GalleryPage'
import NewsPage from '@/pages/NewsPage'
import StylesPage from '@/pages/StylesPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import BookPage from '@/pages/BookPage'
import MyAppointmentsPage from '@/pages/MyAppointmentsPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import AdminGalleryPage from '@/pages/admin/AdminGalleryPage'
import AdminNewsPage from '@/pages/admin/AdminNewsPage'
import AdminStylesPage from '@/pages/admin/AdminStylesPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import AdminAppointmentsPage from '@/pages/admin/AdminAppointmentsPage'
import GeneratePage from '@/pages/GeneratePage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/styles" element={<StylesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'artist']} />}>
          <Route path="/book" element={<BookPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'artist']} />}>
          <Route path="/generate" element={<GeneratePage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          <Route path="/admin/news" element={<AdminNewsPage />} />
          <Route path="/admin/styles" element={<AdminStylesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
        </Route>

      </Route>
    </Routes>
  )
}

export default App
