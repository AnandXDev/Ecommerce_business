"use client";

import { useState } from 'react';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Send
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "support@luxecart.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "123 Shopping Street, Commerce City, CC 12345",
      description: "Showroom open Mon-Sat 10AM-7PM"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon-Fri: 9AM-6PM EST",
      description: "Weekend: 10AM-4PM EST"
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "#" },
    { name: "Twitter", icon: "🐦", url: "#" },
    { name: "Instagram", icon: "📷", url: "#" },
    { name: "LinkedIn", icon: "💼", url: "#" }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day hassle-free return policy. Items must be unused and in original packaging."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 25 countries worldwide. International shipping times vary by destination."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email to monitor your delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              We're Here to
              <span className="text-primary block"> Help You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions about your order? Need help with a product? 
              Our friendly support team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              
              <ContactForm 
                onSubmit={async (data) => {
                  setIsSubmitting(true);
                  try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setSubmitStatus('success');
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  } catch (error) {
                    setSubmitStatus('error');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              />

              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-green-600 dark:text-green-400">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-600 dark:text-red-400">
                    Something went wrong. Please try again later.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Get in Touch
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                      <p className="text-sm text-foreground">{info.value}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Follow Us
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <span className="text-xl">{social.icon}</span>
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6" />
                <h3 className="text-xl font-bold">Need Quick Help?</h3>
              </div>
              <p className="mb-4 opacity-90">
                Chat with our support team for instant assistance
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Start Live Chat
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-foreground mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Find Us Here
                </h3>
                <p className="text-muted-foreground mb-4">
                  123 Shopping Street, Commerce City, CC 12345
                </p>
                <Button variant="outline" size="sm">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
