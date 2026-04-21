import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard,
  MdMeetingRoom,
  MdPeople,
  MdPayment,
  MdReport,
  MdAnnouncement,
  MdMenu,
  MdClose,
  MdLogout,
  MdAccessTime,
} from 'react-icons/md';

const navItems = [
  { name: 'Dashboard', path: '/', icon: MdDashboard, roles: ['Admin', 'Student'] },
  { name: 'Rooms', path: '/rooms', icon: MdMeetingRoom, roles: ['Admin'] },
  { name: 'Students', path: '/students', icon: MdPeople, roles: ['Admin'] },
  { name: 'Fees', path: '/fees', icon: MdPayment, roles: ['Admin'] },
  { name: 'Complaints', path: '/complaints', icon: MdReport, roles: ['Admin', 'Student'] },
  { name: 'Notices', path: '/notices', icon: MdAnnouncement, roles: ['Admin', 'Student'] },
  { name: 'Room Requests', path: '/room-requests', icon: MdAccessTime, roles: ['Admin'] },
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px]
          bg-surface-light border-r border-border
          flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <MdMeetingRoom className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">SmartHostel</h1>
            <p className="text-xs text-text-muted">Management System</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-primary/15 text-primary-light shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={`transition-colors ${
                      isActive ? 'text-primary-light' : 'text-text-muted group-hover:text-text-secondary'
                    }`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom User Area */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold uppercase">
              {user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user?.role || 'User'}</p>
              <p className="text-xs text-text-muted truncate">{user?.email || 'user@hostel.com'}</p>
            </div>
            <button onClick={logout} className="p-1 cursor-pointer" title="Logout">
              <MdLogout className="text-text-muted hover:text-danger transition-colors" size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-surface-light hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all cursor-pointer"
          >
            <MdMenu size={22} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-text-muted font-medium">System Online</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
