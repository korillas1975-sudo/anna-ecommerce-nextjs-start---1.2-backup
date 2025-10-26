'use client'

import { Check } from 'lucide-react'

export default function CheckoutSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, title: 'Shipping', description: 'Enter delivery address' },
    { number: 2, title: 'Payment', description: 'Choose payment method' },
    { number: 3, title: 'Review', description: 'Confirm your order' },
  ]

  return (
    <div className="flex items-center justify-between max-w-[600px] mx-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-colors ${
                currentStep > step.number
                  ? 'bg-champagne text-ink'
                  : currentStep === step.number
                  ? 'bg-ink text-white'
                  : 'bg-platinum text-ink-2/40'
              }`}
            >
              {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
            </div>
            <p
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.number ? 'text-ink' : 'text-ink-2/40'
              }`}
            >
              {step.title}
            </p>
            <p className="hidden md:block text-xs text-ink-2/60 mt-1">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-2 transition-colors ${
                currentStep > step.number ? 'bg-champagne' : 'bg-platinum'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
