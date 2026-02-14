import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TractorCard from '@/components/tractors/TractorCard';
import { Tractor, Search, Filter, MapPin } from 'lucide-react';

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
      const response = await fetch('http://localhost:5000/api/tractors');
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
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <Tractor className="h-8 w-8 text-primary" />
          {t("rentATractor")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("findAndRent")}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchByModel")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <button
          onClick={() => setFilterAvailable(!filterAvailable)}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg border transition-all ${
            filterAvailable
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">{t("availableOnly")}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
          <Tractor className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{tractors.length} {t("totalTractors")}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
          <div className="h-2 w-2 rounded-full bg-success" />
          <span className="text-sm font-medium text-success">{availableCount} {t("available")}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
          <MapPin className="h-4 w-4 text-secondary" />
          <span className="text-sm font-medium">{t("multipleLocations")}</span>
        </div>
      </div>

      {/* Tractor Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">{t("loadingTractors")}</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <Tractor className="h-16 w-16 text-danger/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-danger mb-2">{t("errorLoadingTractors")}</h3>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={fetchTractors}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : filteredTractors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="text-center py-16">
          <Tractor className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">{t("noTractorsFound")}</h3>
          <p className="text-muted-foreground">
            {t("tryAdjustingSearch")}
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 text-center">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          {t("ownATractor")}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t("registerYourTractor")}
        </p>
        <a href="/register" className="btn-secondary">
          {t("registerYourTractorBtn")}
        </a>
      </div>
    </div>
  );
};

export default TractorListing;
