import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  MapPin,
  Tractor,
  Hash,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Gauge,
  Fuel,
} from "lucide-react";
import { toast } from "sonner";
import { getApiUrl } from "../config/api";

interface FormData {
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  model: string;
  tractorNumber: string;
  horsepower: string;
  fuelType: string;
  rentPerHour: string;
  rentPerDay: string;
  isAvailable: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const TractorRegistration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    model: "",
    tractorNumber: "",
    horsepower: "",
    fuelType: "Diesel",
    rentPerHour: "",
    rentPerDay: "",
    isAvailable: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ownerName.trim()) newErrors.ownerName = t("ownerNameRequired");

    if (!formData.email.trim())
      newErrors.email = t("emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t("invalidEmail");

    if (!formData.phone.trim()) newErrors.phone = t("phoneRequired");
    if (!formData.location.trim()) newErrors.location = t("locationRequired");
    if (!formData.model.trim()) newErrors.model = t("modelRequired");
    if (!formData.tractorNumber.trim())
      newErrors.tractorNumber = t("tractorNumberRequired");

    if (!formData.horsepower || Number(formData.horsepower) <= 0)
      newErrors.horsepower = t("invalidHorsepower");

    if (!formData.rentPerHour || Number(formData.rentPerHour) <= 0)
      newErrors.rentPerHour = t("invalidHourlyRate");

    if (!formData.rentPerDay || Number(formData.rentPerDay) <= 0)
      newErrors.rentPerDay = t("invalidDailyRate");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler (FIXED)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("pleaseFixErrors"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        getApiUrl('/api/tractors/register'),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          // ✅ IMPORTANT: convert numbers
          body: JSON.stringify({
            ownerName: formData.ownerName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            model: formData.model,
            tractorNumber: formData.tractorNumber,
            horsepower: Number(formData.horsepower),
            fuelType: formData.fuelType,
            rentPerHour: Number(formData.rentPerHour),
            rentPerDay: Number(formData.rentPerDay),
            isAvailable: formData.isAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("registrationFailed"));
      }

      toast.success(t("registrationSuccess"));
      navigate("/tractors");
    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error(error.message || t("backendNotReachable"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Input handler
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="page-container py-4 md:py-6">
      <div className="mb-6 md:mb-8">
        <h1 className="section-title flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-4xl">
          <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
          {t("registerTractorTitle")}
        </h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm md:text-base">
          {t("registerTractorDesc")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Owner Details Section */}
          <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8">
            <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              {t("tractorRegistration")}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {/* Owner Name */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("ownerName")} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder={t("enterYourFullName")}
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.ownerName ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.ownerName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("email")} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t("exampleEmail")}
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("phoneNumber")} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={t("examplePhone")}
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.phone ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("location")} *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={t("cityState")}
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.location ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tractor Details Section */}
          <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8">
            <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              {t("tractorDetails")}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {/* Tractor Model */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("tractorModel")} *
                </label>
                <div className="relative">
                  <Tractor className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder={t("exampleModel")}
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.model ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.model && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.model}
                  </p>
                )}
              </div>

              {/* Tractor Number */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("tractorNumber")} *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.tractorNumber}
                    onChange={(e) => handleInputChange('tractorNumber', e.target.value)}
                    placeholder={t("exampleTractorNumber")}
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.tractorNumber ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.tractorNumber && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.tractorNumber}
                  </p>
                )}
              </div>

              {/* Horsepower */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("horsepower")} (HP) *
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.horsepower}
                    onChange={(e) => handleInputChange('horsepower', e.target.value)}
                    placeholder={t("exampleHorsepower")}
                    min="0"
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.horsepower ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.horsepower && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.horsepower}
                  </p>
                )}
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("fuelType")} *
                </label>
                <div className="relative">
                  <Fuel className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <select
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.fuelType ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  >
                    <option value="Diesel">{t("diesel")}</option>
                    <option value="Petrol">{t("petrol")}</option>
                    <option value="Bio-Diesel">{t("bioDiesel")}</option>
                  </select>
                </div>
                {errors.fuelType && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.fuelType}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8">
            <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              {t("tractorRental")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* Rent Per Hour */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("rentPerHour")} (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.rentPerHour}
                    onChange={(e) => handleInputChange('rentPerHour', e.target.value)}
                    placeholder={t("exampleRentHour")}
                    min="0"
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.rentPerHour ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.rentPerHour && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.rentPerHour}
                  </p>
                )}
              </div>

              {/* Rent Per Day */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-foreground mb-1.5 md:mb-2">
                  {t("rentPerDay")} (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.rentPerDay}
                    onChange={(e) => handleInputChange('rentPerDay', e.target.value)}
                    placeholder={t("exampleRentDay")}
                    min="0"
                    className={`input-field pl-10 sm:pl-12 text-xs sm:text-sm md:text-base ${
                      errors.rentPerDay ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
                    }`}
                  />
                </div>
                {errors.rentPerDay && (
                  <p className="text-xs sm:text-sm text-danger mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.rentPerDay}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground">{t("availabilityStatus")}</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  {t("setAvailable")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('isAvailable', !formData.isAvailable)}
                className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors ${
                  formData.isAvailable ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 sm:h-6 w-5 sm:w-6 rounded-full bg-white shadow-md transition-all ${
                    formData.isAvailable ? 'left-6 sm:left-7' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {t("registering")}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                {t("registerTractor")}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TractorRegistration;
