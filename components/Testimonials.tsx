'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import 'swiper/css'
import styles from './Testimonials.module.css'

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: 'The craftsmanship is extraordinary. My pearl necklace has become my signature piece. I receive compliments every time I wear it.',
    author: 'Sarah Mitchell',
    location: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    rating: 5,
    text: 'Anna Paris exceeded my expectations. The quality is impeccable, and the customer service made the entire experience delightful.',
    author: 'Emma Thompson',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    rating: 5,
    text: 'I purchased an engagement ring here, and it was perfect. The attention to detail and the elegance of the design are unmatched.',
    author: 'Michael Chen',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    rating: 5,
    text: 'Timeless elegance at its finest. These pieces are investment jewelry that I will treasure and pass down for generations.',
    author: 'Isabella Rossi',
    location: 'Milan, Italy',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
  }
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className={styles.testimonials}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <p className={styles.label}>Customer Stories</p>
          <h2 className={styles.title}>What Our Clients Say</h2>
        </motion.div>

        <motion.div
          className={styles.swiperWrapper}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className={styles.swiper}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className={styles.card}>
                  <div className={styles.stars}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                  <p className={styles.quote}>{testimonial.text}</p>
                  <div className={styles.author}>
                    <div className={styles.authorImage}>
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </div>
                    <div className={styles.authorInfo}>
                      <p className={styles.authorName}>{testimonial.author}</p>
                      <p className={styles.authorLocation}>{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}
