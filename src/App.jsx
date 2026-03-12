import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import './i18n/index.js'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Spinner from './components/ui/Spinner'
import { useUiStore } from './store/uiStore'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AnimalList = lazy(() => import('./pages/animals/AnimalList'))
const AnimalForm = lazy(() => import('./pages/animals/AnimalForm'))
const CategoryList = lazy(() => import('./pages/categories/CategoryList'))
const ControlList = lazy(() => import('./pages/controls/ControlList'))
const ControlForm = lazy(() => import('./pages/controls/ControlForm'))
const UserList = lazy(() => import('./pages/users/UserList'))
const AdoptionList = lazy(() => import('./pages/adoptions/AdoptionList'))
const AdoptionForm = lazy(() => import('./pages/adoptions/AdoptionForm'))
const Reports = lazy(() => import('./pages/reports/Reports'))
const Profile = lazy(() => import('./pages/Profile'))

const ANIMALISTA = ['animalista', 'administrador']
const ADMIN = ['administrador']

function AppInitializer() {
  const darkMode = useUiStore((s) => s.darkMode)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])
  return null
}

const Fallback = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner size="lg" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/adoptions" element={<AdoptionList />} />
            <Route path="/adoptions/new" element={<AdoptionForm />} />

            <Route path="/animals" element={<ProtectedRoute roles={ANIMALISTA}><AnimalList /></ProtectedRoute>} />
            <Route path="/animals/new" element={<ProtectedRoute roles={ANIMALISTA}><AnimalForm /></ProtectedRoute>} />
            <Route path="/animals/:id/edit" element={<ProtectedRoute roles={ANIMALISTA}><AnimalForm /></ProtectedRoute>} />

            <Route path="/categories" element={<ProtectedRoute roles={ANIMALISTA}><CategoryList /></ProtectedRoute>} />
            <Route path="/controls" element={<ProtectedRoute roles={ANIMALISTA}><ControlList /></ProtectedRoute>} />
            <Route path="/controls/new" element={<ProtectedRoute roles={ANIMALISTA}><ControlForm /></ProtectedRoute>} />

            <Route path="/users" element={<ProtectedRoute roles={ADMIN}><UserList /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute roles={ANIMALISTA}><Reports /></ProtectedRoute>} />
            <Route path="/reports/animal/:id" element={<ProtectedRoute roles={ANIMALISTA}><Reports /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
