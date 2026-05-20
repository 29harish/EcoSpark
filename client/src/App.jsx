import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/student/Dashboard'
import Missions from './pages/student/Missions'
import Quiz from './pages/student/Quiz'
import Garden from './pages/student/Garden'
import Leaderboard from './pages/student/Leaderboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import Landing from './pages/Landing'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/missions" element={
            <ProtectedRoute><Missions /></ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute><Quiz /></ProtectedRoute>
          } />
          <Route path="/garden" element={
            <ProtectedRoute><Garden /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><Leaderboard /></ProtectedRoute>
          } />
          <Route path="/teacher" element={
            <ProtectedRoute><TeacherDashboard /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App