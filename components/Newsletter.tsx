'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
    setEmail('')

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <section ref={ref} className={styles.newsletter}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>Join Our Inner Circle</h2>
          <p className={styles.description}>
            Subscribe to receive exclusive access to new collections, private sales,<br className={styles.hideMobile} />
            and curated style inspiration delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={styles.input}
                required
                disabled={isSubmitting || isSubmitted}
              />
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitting ? 'Subscribing...' : isSubmitted ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </form>

          <p className={styles.privacy}>
            By subscribing, you agree to our{' '}
            <a href="/privacy-policy" className={styles.link}>
              Privacy Policy
            </a>
            . Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
