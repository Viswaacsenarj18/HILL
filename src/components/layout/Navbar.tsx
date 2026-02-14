import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Tractor,
  UserPlus,
  Menu,
  X,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/images/logo.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const location = useLocation();
  const { t, i18n } = useTranslation();

  /* ================= NAV ITEMS ================= */

  const navItems = [
    { to: "/", label: t("dashboard"), icon: LayoutDashboard },
    { to: "/sensors", label: t("sensors"), icon: Activity },
    { to: "/tractors", label: t("rentTractor"), icon: Tractor },
    { to: "/register", label: t("register"), icon: UserPlus },
  ];

  /* ================= LANGUAGE OPTIONS ================= */

  const languages = [
    { code: "en", label: "English" },
    { code: "ta", label: "தமிழ்" },
    { code: "kn", label: "ಕನ್ನಡ" },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="sticky top-0 z-50 hidden md:block bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="HillSmart Logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <h1 className="font-bold text-lg">HillSmart</h1>
                <p className="text-xs text-muted-foreground">
                  {t("smartPlatform")}
                </p>
              </div>
            </NavLink>

            {/* Navigation */}
            <div className="flex items-center gap-4 relative"  style={{ direction: i18n.language === 'ta' ? 'rtl' : 'ltr' }}>

              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`
                  }
                  style={{ textAlign: i18n.language === 'ta' ? 'right' : 'left' }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              {/* 🌍 Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted"
                  style={{ direction: i18n.language === 'ta' ? 'rtl' : 'ltr' }}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {i18n.language.toUpperCase()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-xl border z-50" style={{ direction: i18n.language === 'ta' ? 'rtl' : 'ltr', textAlign: i18n.language === 'ta' ? 'right' : 'left' }}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-4 py-2 text-sm hover:bg-muted rounded-lg ${
                          i18n.language === lang.code
                            ? "bg-primary/10 text-primary font-medium"
                            : ""
                        }`}
                        style={{ textAlign: i18n.language === 'ta' ? 'right' : 'left' }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE TOP NAV ================= */}
      <nav className="sticky top-0 z-50 md:hidden bg-card/90 backdrop-blur-lg border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">

          <NavLink to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="HillSmart Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="font-bold text-lg">HillSmart</span>
          </NavLink>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="bg-white border-t shadow-lg p-4 space-y-3">

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}

            {/* Language Section Mobile */}
            <div className="pt-3 border-t">
              <p className="text-sm font-semibold mb-2">
                {t("language")}
              </p>
              <div className="flex gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      i18n.language === lang.code
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
