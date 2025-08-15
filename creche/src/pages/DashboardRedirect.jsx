import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function DashboardRedirect() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'admin') navigate('/AdminDashBoard')
    else if (user?.role === 'parent') navigate('/ParentDashBoard')
    else navigate('/')
  }, [user, navigate])

  return null
}

export default DashboardRedirect;
