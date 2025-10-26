'use client'

import { useState } from 'react'

export interface ShippingFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormValues) => void
}

export default function ShippingForm({ onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Thailand',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-hairline p-6 md:p-8 space-y-6">
      <h2 className="font-serif text-[1.5rem] font-medium text-ink mb-6">Shipping Information</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-sm text-ink mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
          <label className="block text-sm text-ink mb-2">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink mb-2">Address Line 1 *</label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          required
          className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="block text-sm text-ink mb-2">Address Line 2</label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-ink mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-sm text-ink mb-2">State / Province</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-sm text-ink mb-2">Postal Code *</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink mb-2">Country *</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full border border-hairline px-4 py-3 focus:outline-none focus:border-ink"
        >
          <option value="Thailand">Thailand</option>
          <option value="USA">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="Japan">Japan</option>
          <option value="Singapore">Singapore</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-ink text-white py-4 uppercase tracking-wider text-sm hover:bg-ink-2 transition-colors"
      >
        Continue to Payment
      </button>
    </form>
  )
}
