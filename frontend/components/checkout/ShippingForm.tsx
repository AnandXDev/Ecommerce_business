'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin,
  CreditCard,
  Shield
} from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';

// Form validation schema
const shippingSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
    country: z.string().min(2, 'Country is required')
  }),
  saveAddress: z.boolean().default(false)
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' }
];

export function ShippingForm() {
  const { formData, updateFormData, nextStep } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      saveAddress: false
    }
  });

  const watchedValues = watch();

  // Update checkout form data when form values change
  const handleFormChange = () => {
    updateFormData({
      email: watchedValues.email,
      firstName: watchedValues.firstName,
      lastName: watchedValues.lastName,
      phone: watchedValues.phone,
      address: watchedValues.address
    });
  };

  const onSubmit = async (data: ShippingFormData) => {
    setIsLoading(true);
    try {
      // Update checkout form data
      updateFormData({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address
      });

      // Move to next step
      nextStep();
    } catch (error) {
      console.error('Error submitting shipping form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Mock geocoding - in real app, would use geocoding API
          setValue('address.city', 'New York');
          setValue('address.state', 'NY');
          setValue('address.zipCode', '10001');
          setValue('address.country', 'US');
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Shipping Information</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...register('email')}
                    className="pl-10"
                    error={errors.email?.message}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register('phone')}
                    className="pl-10"
                    error={errors.phone?.message}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Recipient Name</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John"
                    {...register('firstName')}
                    className="pl-10"
                    error={errors.firstName?.message}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  placeholder="Doe"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Shipping Address</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseCurrentLocation}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Street Address
              </label>
              <Input
                type="text"
                placeholder="123 Main Street, Apt 4B"
                {...register('address.street')}
                error={errors.address?.street?.message}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City
                </label>
                <Input
                  type="text"
                  placeholder="New York"
                  {...register('address.city')}
                  error={errors.address?.city?.message}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State
                </label>
                <select
                  {...register('address.state')}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.address?.state?.message && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ZIP Code
                </label>
                <Input
                  type="text"
                  placeholder="10001"
                  {...register('address.zipCode')}
                  error={errors.address?.zipCode?.message}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Country
              </label>
              <select
                {...register('address.country')}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.address?.country?.message && (
                <p className="text-sm text-destructive mt-1">
                  {errors.address.country.message}
                </p>
              )}
            </div>
          </div>

          {/* Save Address */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveAddress"
              {...register('saveAddress')}
            />
            <label htmlFor="saveAddress" className="text-sm text-muted-foreground">
              Save this address for future orders
            </label>
          </div>

          {/* Security Badge */}
          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Your information is secure and encrypted
            </span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue to Shipping Method'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
