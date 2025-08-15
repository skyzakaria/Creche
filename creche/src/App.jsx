import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import News from './pages/News'
import Contact from './pages/Contact'
import Header from './components/Header'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Payments from './pages/Payments'
import AdminDashBoard from './pages/AdminDashBoard'
import ParentDashBoard from './pages/ParentDashBoard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminKidsManager from './pages/AdminKidsManager'
import ParentKidsList from './pages/ParentKidsList'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


function DashboardRedirect() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/Login" />;
  if (user.role === 'admin') return <Navigate to="/AdminDashBoard" />;
  if (user.role === 'parent') return <Navigate to="/ParentDashBoard" />;

  return <Navigate to="/" />;
}

function App() {
  return (
    <div>

    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="About" element={<About />} />
        <Route path="Gallery" element={<Gallery />} />
        <Route path="News" element={<News />} />
        <Route path="Contact" element={<Contact />} />
        <Route path="Login" element={<Login />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="AdminDashBoard" element={
          <ProtectedRoute role="admin">
            <AdminDashBoard />
          </ProtectedRoute>
        } />
        <Route path="ParentDashBoard" element={
          <ProtectedRoute role="parent">
            <ParentDashBoard />
          </ProtectedRoute>
        } />
        <Route path="Dashboard" element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } />

        <Route path="Payments" element={
          <ProtectedRoute role="admin">
            <Payments />
          </ProtectedRoute>
        } />

        <Route path="AdminKids" element={
        <ProtectedRoute role="admin">
          <AdminKidsManager />
        </ProtectedRoute>
      } />

      <Route path="MesEnfants" element={
        <ProtectedRoute role="parent">
          <ParentKidsList />
        </ProtectedRoute>
      } />
      </Routes>
    </Router>
</ div>
  )
}

export default App