'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send to API
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="border-b border-hairline bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12">
          <h1 className="font-serif text-[2rem] md:text-[3rem] font-medium text-ink">Contact Us</h1>
          <p className="text-ink-2/70 mt-2">We would love to hear from you</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-[1.75rem] font-medium text-ink mb-6">Get in Touch</h2>
              <p className="text-ink-2/70 leading-relaxed">
                Whether you have a question about our products, need assistance with an order, or simply want to share feedback, our team is here to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-champagne flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-ink mb-1">Visit Our Boutique</p>
                  <p className="text-ink-2/70">
                    123 Luxury Avenue<br />
                    Bangkok 10110, Thailand
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-champagne flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-ink mb-1">Call Us</p>
                  <p className="text-ink-2/70">+66 2 123 4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-champagne flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-ink mb-1">Email Us</p>
                  <p className="text-ink-2/70">contact@annaparis.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-champagne flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-ink mb-1">Business Hours</p>
                  <p className="text-ink-2/70">
                    Mon - Sat: 10:00 AM - 8:00 PM<br />
                    Sun: 11:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-hairline p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <h3 className="font-serif text-[1.5rem] font-medium text-ink mb-4">Thank You!</h3>
                <p className="text-ink-2/70">We&rsquo;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-ink mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-sm text-ink mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-sm text-ink mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-sm text-ink mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
                  >
                    <option value="">Select a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="custom">Custom Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-ink mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-ink text-white py-4 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
