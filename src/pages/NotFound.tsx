import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-8">
      <div className="text-center">
        <h1 className="mb-2 sm:mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{t("pageNotFound")}</h1>
        <p className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-muted-foreground">{t("notFoundMessage")}</p>
        <a href="/" className="inline-block text-sm sm:text-base md:text-lg text-primary hover:text-primary/90 underline transition-colors font-medium">
          {t("goHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
