"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Send, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = [
    'General Inquiry',
    'Order Support',
    'Product Question',
    'Technical Issue',
    'Partnership Opportunity',
    'Feedback',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Your Name *
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="John Doe"
          className={errors.name ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address *
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="john@example.com"
          className={errors.email ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          Subject *
        </label>
        <select
          id="subject"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          className={`w-full p-3 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.subject ? 'border-red-500' : 'border-input'
          }`}
          disabled={isSubmitting}
        >
          <option value="">Select a subject</option>
          {subjectOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message *
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Tell us more about your inquiry..."
          rows={5}
          className={`w-full p-3 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none ${
            errors.message ? 'border-red-500' : 'border-input'
          }`}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.message && (
            <p className="text-sm text-red-600">{errors.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.message.length}/500 characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </>
        )}
      </Button>

      {/* Additional Info */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4" />
          <span>We typically respond within 24 hours</span>
        </div>
      </div>
    </form>
  );
}
