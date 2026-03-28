"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, Gift, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
  };

  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Successfully Subscribed!</h2>
            <p className="text-lg opacity-90">
              Thank you for joining our newsletter. Check your email for a special welcome offer!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">STAY UPDATED</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Get Exclusive Offers & Updates
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Join our newsletter and be the first to know about new products, 
                special promotions, and insider tips.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="text-sm">15% off your first order</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm">Early access to new products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm">Member-only deals and discounts</span>
                </div>
              </div>
            </div>

            {/* Right Content - Newsletter Form */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="text-center">
                <CardTitle>Subscribe Now</CardTitle>
                <CardDescription>
                  Enter your email to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-center"
                  />
                  
                  <div className="text-xs text-muted-foreground text-center">
                    By subscribing, you agree to our Privacy Policy and Terms of Service.
                    We respect your inbox and promise to send only valuable content.
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>

                {/* Social Proof */}
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center text-sm text-muted-foreground mb-4">
                    Join 10,000+ happy subscribers
                  </div>
                  <div className="flex justify-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full"
                        style={{ opacity: 1 - (i * 0.2) }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
