'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import styles from './InstagramGallery.module.css'

const instagramPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop',
    alt: 'Pearl necklace styled',
    color: '#FFFF00' // Yellow
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=1200&fit=crop',
    alt: 'Luxury jewelry display',
    color: '#FF00FF' // Magenta
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=1300&fit=crop',
    alt: 'Elegant pearl earrings',
    color: '#0000FF' // Blue
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=1100&fit=crop',
    alt: 'Diamond ring close up',
    color: '#00FF00' // Green
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=1000&fit=crop',
    alt: 'Bracelet styling',
    color: '#FF0000' // Red
  }
]

export default function InstagramGallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className={styles.instagram}>
      <div className={styles.container}>
        {/* Bento Grid Layout */}
        <div className={styles.bentoWrapper}>
          {/* Left Side - Staggered Images */}
          <motion.div
            className={styles.bentoGrid}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            {instagramPosts.map((post, index) => (
              <motion.a
                key={post.id}
                href="https://instagram.com/annaparisjewelry"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.bentoCard} ${styles[`card${index + 1}`]}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    sizes="(max-width: 768px) 110px, (max-width: 1024px) 175px, 250px"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className={styles.overlay}>
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
                    </svg>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Right Side - Hashtag & Branding */}
          <motion.div
            className={styles.branding}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.brandingContent}>
              <h2 className={styles.hashtag}>#AnnaParisJewelry</h2>
              <p className={styles.tagline}>Follow our journey and be inspired by our community</p>

              <div className={styles.instagramLogo}>
                <span className={styles.logoScript}>Instagram</span>
              </div>

              <a
                href="https://instagram.com/annaparisjewelry"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.followButton}
              >
                Follow Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
