import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Tractor, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/images/logo.jpeg'; // Adjust path if needed

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/sensors', label: 'Sensors', icon: Activity },
  { to: '/tractors', label: 'Rent Tractor', icon: Tractor },
  { to: '/register', label: 'Register', icon: UserPlus },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 hidden md:block bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="HillSmart Logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">
                  HillSmart
                </h1>
                <p className="text-xs text-muted-foreground">
                  Smart Farming Platform
                </p>
              </div>
            </NavLink>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link rounded-lg flex items-center gap-2 px-4 py-2 ${
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="sticky top-0 z-50 md:hidden bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">
          
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="HillSmart Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="font-display text-lg font-bold text-foreground">
              HillSmart
            </span>
          </NavLink>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-14 bg-card border-b border-border shadow-lg animate-fade-in">
            <div className="p-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-inset-bottom">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    isActive ? 'bg-primary/15' : ''
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? 'animate-scale-in' : ''}`}
                  />
                </div>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
