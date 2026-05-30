import { useState, useEffect, type FC, type ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string | number;
}

interface AppLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  title: string;
  userRole: 'candidate' | 'recruiter';
}

const AppLayout: FC<AppLayoutProps> = ({ children, sidebarItems, title, userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  const sidebarContent = (
    <>
      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {(!collapsed || mobileOpen) && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="border-t border-surface-200 p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-600 transition-colors hover:bg-danger-50 hover:text-danger-600"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-200 bg-white transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-surface-200 px-3">
          <Logo size="sm" showText />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-surface-200 bg-white transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-surface-200 px-3">
          <Logo size="sm" showText={!collapsed} />
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-lg p-1 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 lg:h-16 items-center justify-between border-b border-surface-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1.5 text-surface-500 hover:bg-surface-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg lg:text-xl font-semibold text-surface-900 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Notification bell */}
            <button className="relative rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen((o) => !o); }}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-100"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {initials}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-surface-900 truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-xs capitalize text-surface-500">{userRole}</p>
                </div>
                <ChevronDown className="hidden sm:block h-4 w-4 text-surface-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-surface-200 bg-white py-1 shadow-lg">
                  <div className="px-4 py-2 border-b border-surface-100 sm:hidden">
                    <p className="text-sm font-medium text-surface-900">{user?.name}</p>
                    <p className="text-xs capitalize text-surface-500">{userRole}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
