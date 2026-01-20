import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      const response = await fetch(`http://localhost:5000/api/tractors/${id}`);
      if (!response.ok) throw new Error('Tractor not found');
      const data = await response.json();
      setTractor(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tractor details');
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
      toast.error('Please select a start date');
      return;
    }

    if (!renterName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!renterEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setIsConfirming(true);

    try {
      const response = await fetch('http://localhost:5000/api/tractors/confirm-rental', {
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
        toast.success('✅ Rental confirmed! Confirmation emails sent.');
        setTimeout(() => {
          navigate('/tractors');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to confirm rental');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error confirming rental. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="page-container">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back to listing</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tractor Details */}
        <div className="space-y-6">
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 aspect-video flex items-center justify-center">
            <Tractor className="h-24 w-24 text-primary/40" />
            {tractor && (
              <span
                className={`absolute top-4 right-4 status-badge ${
                  tractor.isAvailable ? 'status-badge-available' : 'status-badge-rented'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    tractor.isAvailable ? 'bg-success' : 'bg-danger'
                  }`}
                />
                {tractor.isAvailable ? 'Available' : 'Rented'}
              </span>
            )}
          </div>

          {/* Basic Info */}
          {tractor && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {tractor.model}
            </h1>
            <p className="text-muted-foreground mb-4">
              Registration: {tractor.tractorNumber}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-foreground">
                <User className="h-5 w-5 text-primary" />
                <span>{tractor.ownerName}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span>{tractor.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{tractor.location}</span>
              </div>
            </div>
          </div>
          )}

          {/* Specifications */}
          {tractor && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Gauge className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Power</p>
                  <p className="font-medium text-foreground">
                    {tractor.horsepower} HP
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Fuel className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Fuel</p>
                  <p className="font-medium text-foreground">
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
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Book This Tractor
            </h3>

            {/* Rental Type Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Rental Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setRentalType('hourly')}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    rentalType === 'hourly'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Clock className={`h-5 w-5 mx-auto mb-2 ${
                    rentalType === 'hourly' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`font-semibold ${
                    rentalType === 'hourly' ? 'text-primary' : 'text-foreground'
                  }`}>
                    Hourly
                  </p>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    <span>{tractor.rentPerHour}/hr</span>
                  </div>
                </button>
                <button
                  onClick={() => setRentalType('daily')}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    rentalType === 'daily'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Calendar className={`h-5 w-5 mx-auto mb-2 ${
                    rentalType === 'daily' ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`font-semibold ${
                    rentalType === 'daily' ? 'text-primary' : 'text-foreground'
                  }`}>
                    Daily
                  </p>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <IndianRupee className="h-3 w-3" />
                    <span>{tractor.rentPerDay}/day</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Duration ({rentalType === 'hourly' ? 'Hours' : 'Days'})
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="h-12 w-12 rounded-lg border border-border flex items-center justify-center text-xl font-semibold hover:bg-muted transition-colors"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className="font-display text-3xl font-bold text-foreground">
                    {duration}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {rentalType === 'hourly' ? 'hour(s)' : 'day(s)'}
                  </span>
                </div>
                <button
                  onClick={() => setDuration(duration + 1)}
                  className="h-12 w-12 rounded-lg border border-border flex items-center justify-center text-xl font-semibold hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Renter Details */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name & Phone number*
                </label>
                <input
                  type="text"
                  value={renterName}
                  onChange={(e) => setRenterName(e.target.value)}
                  placeholder="Enter your full name & Phone numberl"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={renterEmail}
                  onChange={(e) => setRenterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                />
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">
                  {rentalType === 'hourly' ? 'Hourly Rate' : 'Daily Rate'}
                </span>
                <div className="flex items-center font-medium">
                  <IndianRupee className="h-4 w-4" />
                  {rentalType === 'hourly' ? tractor.rentPerHour : tractor.rentPerDay}
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {duration} {rentalType === 'hourly' ? 'hour(s)' : 'day(s)'}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total Cost</span>
                  <div className="flex items-center text-xl font-bold text-primary">
                    <IndianRupee className="h-5 w-5" />
                    {totalCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmRent}
              disabled={isConfirming || !tractor.isAvailable}
              className={`w-full py-4 rounded-lg font-semibold transition-all ${
                tractor.isAvailable
                  ? 'btn-primary'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isConfirming ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Confirming...
                </span>
              ) : tractor.isAvailable ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Confirm Rental
                </span>
              ) : (
                'Not Available'
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground mt-4">
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
