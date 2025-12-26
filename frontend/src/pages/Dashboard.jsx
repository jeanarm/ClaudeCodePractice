import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

function Dashboard() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [stats, setStats] = useState({ employees: 0, pendingLeaves: 0, documents: 0, totalLeaves: 0 })
  const [employees, setEmployees] = useState([])
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [announcementsRes, employeesRes, leavesRes, documentsRes] = await Promise.all([
        api.get('/announcements?limit=5'),
        api.get('/employees'),
        api.get('/leaves'),
        api.get('/documents')
      ])

      setAnnouncements(announcementsRes.data)
      setEmployees(employeesRes.data)
      setLeaves(leavesRes.data)
      setStats({
        employees: employeesRes.data.length,
        pendingLeaves: leavesRes.data.filter(l => l.status === 'pending').length,
        documents: documentsRes.data.length,
        totalLeaves: leavesRes.data.length
      })
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Process data for charts
  const getDepartmentData = () => {
    const deptCount = {}
    employees.forEach(emp => {
      const dept = emp.department || 'Unknown'
      deptCount[dept] = (deptCount[dept] || 0) + 1
    })
    return Object.entries(deptCount).map(([name, value]) => ({ name, value }))
  }

  const getLeaveStatusData = () => {
    const statusCount = { pending: 0, approved: 0, rejected: 0 }
    leaves.forEach(leave => {
      statusCount[leave.status] = (statusCount[leave.status] || 0) + 1
    })
    return [
      { name: 'Pending', value: statusCount.pending, color: '#F59E0B' },
      { name: 'Approved', value: statusCount.approved, color: '#10B981' },
      { name: 'Rejected', value: statusCount.rejected, color: '#EF4444' }
    ]
  }

  const getLeaveTypeData = () => {
    const typeCount = {}
    leaves.forEach(leave => {
      const type = leave.leave_type || 'other'
      typeCount[type] = (typeCount[type] || 0) + 1
    })
    return Object.entries(typeCount).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count
    }))
  }

  const getMonthlyLeaveData = () => {
    const monthlyData = {}
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    leaves.forEach(leave => {
      const date = new Date(leave.start_date)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    return Object.entries(monthlyData)
      .slice(-6)
      .map(([month, requests]) => ({ month, requests }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading dashboard: {error}
      </div>
    )
  }

  const departmentData = getDepartmentData()
  const leaveStatusData = getLeaveStatusData()
  const leaveTypeData = getLeaveTypeData()
  const monthlyLeaveData = getMonthlyLeaveData()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user?.email}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/employees" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.employees}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/leaves" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Leaves</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Leave Requests</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.totalLeaves}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <Link to="/documents" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Documents</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stats.documents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees by Department */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employees by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Status Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leaveStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {leaveStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Types */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyLeaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Announcements</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {announcements.length === 0 ? (
            <li className="px-4 py-4 text-gray-500 text-center">No announcements yet</li>
          ) : (
            announcements.map((announcement) => (
              <li key={announcement.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{announcement.content}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </li>
            ))
          )}
        </ul>
        {announcements.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 text-right">
            <Link to="/announcements" className="text-sm text-blue-600 hover:text-blue-500">
              View all announcements
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
