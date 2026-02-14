import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Tractor,
  User,
  Phone,
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Fuel,
  Gauge,
} from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '../config/api';

interface TractorData {
  _id: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  model: string;
  tractorNumber: string;
  horsepower: number;
  fuelType: string;
  rentPerHour: number;
  rentPerDay: number;
  isAvailable: boolean;
}

const RentTractor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tractor, setTractor] = useState<TractorData | null>(null);
  const [loading, setLoading] = useState(true);

  const [rentalType, setRentalType] = useState<'hourly' | 'daily'>('daily');
  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [renterName, setRenterName] = useState('');
  const [renterEmail, setRenterEmail] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    fetchTractor();
  }, [id]);

  const fetchTractor = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/api/tractors/${id}`));
      if (!response.ok) throw new Error('Tractor not found');
      const data = await response.json();
      setTractor(data);
    } catch (err) {
      console.error(err);
      toast.error(t("errorLoadingData"));
    } finally {
      setLoading(false);
    }
  };

  const totalCost = useMemo(() => {
    if (!tractor) return 0;
    return rentalType === 'hourly'
      ? tractor.rentPerHour * duration
      : tractor.rentPerDay * duration;
  }, [tractor, rentalType, duration]);

  const handleConfirmRent = async () => {
    if (!startDate) {
      toast.error(t("selectStartDate"));
      return;
    }

    if (!renterName.trim()) {
      toast.error(t("enterName"));
      return;
    }

    if (!renterEmail.trim()) {
      toast.error(t("enterEmail"));
      return;
    }

    setIsConfirming(true);

    try {
      const response = await fetch(getApiUrl('/api/tractors/confirm-rental'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tractorId: id,
          renterEmail: renterEmail,
          renterName: renterName,
          startDate,
          rentalType,
          duration,
          totalCost,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t("rentalConfirmed"));
        setTimeout(() => {
          navigate('/tractors');
        }, 2000);
      } else {
        toast.error(data.message || t("failedToConfirmRental"));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t("errorConfirmingRental"));
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="page-container py-4 md:py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground mb-4 md:mb-6 transition-colors text-xs sm:text-sm md:text-base"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>{t("backToListing")}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {/* Tractor Details */}
        <div className="space-y-4 md:space-y-6">
          {/* Image */}
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 aspect-video flex items-center justify-center">
            <Tractor className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-primary/40" />
            {tractor && (
              <span
                className={`absolute top-3 sm:top-4 right-3 sm:right-4 status-badge text-xs sm:text-sm md:text-base ${
                  tractor.isAvailable ? 'status-badge-available' : 'status-badge-rented'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    tractor.isAvailable ? 'bg-success' : 'bg-danger'
                  }`}
                />
                {tractor.isAvailable ? t("available") : t("available")}
              </span>
            )}
          </div>

          {/* Basic Info */}
          {tractor && (
          <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8">
            <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
              {tractor.model}
            </h1>
            <p className="text-muted-foreground mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
              {t("registration")}: {tractor.tractorNumber}
            </p>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-foreground text-xs sm:text-sm md:text-base">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>{tractor.ownerName}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-foreground text-xs sm:text-sm md:text-base">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>{tractor.phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-foreground text-xs sm:text-sm md:text-base">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>{tractor.location}</span>
              </div>
            </div>
          </div>
          )}

          {/* Specifications */}
          {tractor && (
          <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8">
            <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              {t("specifications")}
            </h3>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg bg-muted/50">
                <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Power</p>
                  <p className="font-medium text-sm sm:text-base text-foreground">
                    {tractor.horsepower} HP
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg bg-muted/50">
                <Fuel className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Fuel</p>
                  <p className="font-medium text-sm sm:text-base text-foreground">
                    {tractor.fuelType}
                  </p>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Booking Form */}
        {tractor && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8 lg:sticky lg:top-24">
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
              {t("confirmRental")}
            </h3>

            {/* Rental Type Toggle */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">
                {t("rentalDetails")}
              </label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <button
                  onClick={() => setRentalType('hourly')}
                  className={`p-3 sm:p-4 md:p-5 rounded-lg border text-center transition-all text-xs sm:text-sm md:text-base ${
                    rentalType === 'hourly'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Clock className={`h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 md:mb-2 ${
                    rentalType === 'hourly' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`font-semibold ${
                    rentalType === 'hourly' ? 'text-primary' : 'text-foreground'
                  }`}>
                    {t("hourly")}
                  </p>
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    <span>{tractor.rentPerHour}{t("perHour")}</span>
                  </div>
                </button>
                <button
                  onClick={() => setRentalType('daily')}
                  className={`p-3 sm:p-4 md:p-5 rounded-lg border text-center transition-all text-xs sm:text-sm md:text-base ${
                    rentalType === 'daily'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 md:mb-2 ${
                    rentalType === 'daily' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`font-semibold ${
                    rentalType === 'daily' ? 'text-primary' : 'text-foreground'
                  }`}>
                    {t("daily")}
                  </p>
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    <span>{tractor.rentPerDay}{t("perDay")}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">
                {t("duration")} ({rentalType === 'hourly' ? t("hourly").toLowerCase() : t("daily").toLowerCase()})
              </label>
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-border flex items-center justify-center text-lg sm:text-xl font-semibold hover:bg-muted transition-colors text-xs md:text-base"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    {duration}
                  </span>
                  <span className="text-muted-foreground ml-2 text-xs sm:text-sm md:text-base">
                    {rentalType === 'hourly' ? t("hours") : t("days")}
                  </span>
                </div>
                <button
                  onClick={() => setDuration(duration + 1)}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-border flex items-center justify-center text-lg sm:text-xl font-semibold hover:bg-muted transition-colors text-xs md:text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("startDate")}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  placeholder={t("startDate")}
                  className="input-field text-xs sm:text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("startTime")}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder={t("startTime")}
                  className="input-field text-xs sm:text-sm md:text-base"
                />
              </div>
            </div>

            {/* Renter Details */}
            <div className="grid grid-cols-1 gap-2 md:gap-4 mb-4 md:mb-6">
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("renterName")}*
                </label>
                <input
                  type="text"
                  value={renterName}
                  onChange={(e) => setRenterName(e.target.value)}
                  placeholder={t("enterFullNamePhone")}
                  className="input-field text-xs sm:text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("renterEmail")} *
                </label>
                <input
                  type="email"
                  value={renterEmail}
                  onChange={(e) => setRenterEmail(e.target.value)}
                  placeholder={t("enterYourEmail")}
                  className="input-field text-xs sm:text-sm md:text-base"
                />
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 md:p-5 mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-1.5 md:mb-2 text-xs sm:text-sm md:text-base">
                <span className="text-muted-foreground">
                  {rentalType === 'hourly' ? t("hourly") : t("daily")}
                </span>
                <div className="flex items-center font-medium">
                  <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4" />
                  {rentalType === 'hourly' ? tractor.rentPerHour : tractor.rentPerDay}
                </div>
              </div>
              <div className="flex justify-between items-center mb-1.5 md:mb-2 text-xs sm:text-sm md:text-base">
                <span className="text-muted-foreground">{t("duration")}</span>
                <span className="font-medium">
                  {duration} {rentalType === 'hourly' ? 'hour(s)' : 'day(s)'}
                </span>
              </div>
              <div className="border-t border-border pt-1.5 md:pt-2 mt-1.5 md:mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground text-xs sm:text-sm md:text-base">{t("totalCost")}</span>
                  <div className="flex items-center text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" />
                    {totalCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmRent}
              disabled={isConfirming || !tractor.isAvailable}
              className={`w-full py-3 sm:py-4 md:py-5 rounded-lg font-semibold transition-all text-sm sm:text-base md:text-lg ${
                tractor.isAvailable
                  ? 'btn-primary'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isConfirming ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {t("pleaseWait")}...
                </span>
              ) : tractor.isAvailable ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t("confirmRental")}
                </span>
              ) : (
                t("available")
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground mt-2 md:mt-3">
              By confirming, you agree to our rental terms and conditions
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default RentTractor;
