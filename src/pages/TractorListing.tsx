import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TractorCard from '@/components/tractors/TractorCard';
import { Tractor, Search, Filter, MapPin } from 'lucide-react';
import { getApiUrl } from '@/config/api';

const TractorListing = () => {
  const { t } = useTranslation();
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);

  useEffect(() => {
    fetchTractors();
  }, []);

  const fetchTractors = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/api/tractors'));
      if (!response.ok) throw new Error('Failed to fetch tractors');
      const data = await response.json();
      setTractors(data);
      setError('');
    } catch (err) {
      setError('Failed to load tractors. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTractors = tractors.filter((tractor) => {
    const matchesSearch =
      (tractor.model?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (tractor.location?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (tractor.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesFilter = filterAvailable ? tractor.isAvailable : true;
    return matchesSearch && matchesFilter;
  });

  const availableCount = tractors.filter((t) => t.isAvailable).length;

  return (
    <div className="page-container min-h-screen bg-gray-50 md:bg-white">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="section-title flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl">
          <Tractor className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
          {t("rentATractor")}
        </h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base">
          {t("findAndRent")}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchByModel")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 sm:pl-12 text-sm md:text-base"
          />
        </div>
        <button
          onClick={() => setFilterAvailable(!filterAvailable)}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-lg border transition-all text-sm sm:text-base whitespace-nowrap ${
            filterAvailable
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">{t("availableOnly")}</span>
          <span className="sm:hidden font-medium">{t("availableOnly")}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card border border-border text-xs sm:text-sm">
          <Tractor className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="font-medium">{tractors.length} {t("totalTractors")}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/10 border border-success/20 text-xs sm:text-sm">
          <div className="h-2 w-2 rounded-full bg-success" />
          <span className="font-medium text-success">{availableCount} {t("available")}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card border border-border text-xs sm:text-sm">
          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" />
          <span className="font-medium">{t("multipleLocations")}</span>
        </div>
      </div>

      {/* Tractor Grid */}
      {loading ? (
        <div className="text-center py-12 md:py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary border-t-transparent"></div>
          <p className="mt-3 md:mt-4 text-muted-foreground text-sm md:text-base">{t("loadingTractors")}</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 md:py-16 px-4">
          <Tractor className="h-12 w-12 sm:h-16 sm:w-16 text-danger/30 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-danger mb-2">{t("errorLoadingTractors")}</h3>
          <p className="text-muted-foreground text-sm md:text-base">{error}</p>
          <button
            onClick={fetchTractors}
            className="mt-3 md:mt-4 px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm md:text-base"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : filteredTractors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {filteredTractors.map((tractor, index) => (
            <div
              key={tractor._id || tractor.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TractorCard tractor={tractor} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 md:py-16 px-4">
          <Tractor className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/30 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{t("noTractorsFound")}</h3>
          <p className="text-muted-foreground text-sm md:text-base">
            {t("tryAdjustingSearch")}
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 text-center">
        <h3 className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 md:mb-3">
          {t("ownATractor")}
        </h3>
        <p className="text-muted-foreground mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
          {t("registerYourTractor")}
        </p>
        <a href="/register" className="btn-secondary inline-block text-sm md:text-base">
          {t("registerYourTractorBtn")}
        </a>
      </div>
    </div>
  );
};

export default TractorListing;
