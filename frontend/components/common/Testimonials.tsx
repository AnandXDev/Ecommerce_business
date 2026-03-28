'use client';

import { useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export function Testimonials() {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Verified Buyer',
      content: 'Amazing quality products and super fast shipping! The customer service was excellent and helped me track my order every step of the way.',
      avatar: '/avatars/sarah.jpg',
      rating: 5
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Regular Customer',
      content: 'I\'ve been shopping here for months and the experience has been consistently great. Product quality is top-notch and prices are competitive.',
      avatar: '/avatars/mike.jpg',
      rating: 5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Fashion Enthusiast',
      content: 'Love the curated collection of premium products! The dropshipping service is reliable and the packaging is always secure.',
      avatar: '/avatars/emily.jpg',
      rating: 4
    }
  ]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of satisfied customers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-primary-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${
                      index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-6.91 6.26L12 2z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-700 italic">
                {testimonial.content}
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
