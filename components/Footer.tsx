import Image from 'next/image'
import styles from './Footer.module.css'

const footerLinks = {
  shop: [
    { name: 'All Collections', href: '/collections' },
    { name: 'Best Sellers', href: '/best-sellers' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Gift Guide', href: '/gift-guide' }
  ],
  about: [
    { name: 'Our Story', href: '/about' },
    { name: 'Craftsmanship', href: '/craftsmanship' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Press', href: '/press' }
  ],
  customerCare: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Shipping & Returns', href: '/shipping-returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Jewelry Care', href: '/jewelry-care' }
  ]
}

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
      </svg>
    )
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 16.41 4.87 20.12 8.84 21.41C8.76 20.66 8.69 19.48 8.88 18.66L10.13 13.27C10.13 13.27 9.78 12.56 9.78 11.5C9.78 9.86 10.76 8.66 11.98 8.66C13.01 8.66 13.51 9.41 13.51 10.31C13.51 11.31 12.87 12.82 12.54 14.22C12.27 15.4 13.15 16.36 14.31 16.36C16.42 16.36 18.04 14.14 18.04 10.95C18.04 8.11 15.97 6.13 11.94 6.13C7.45 6.13 4.83 9.38 4.83 12.77C4.83 13.77 5.21 14.84 5.68 15.42C5.77 15.54 5.78 15.64 5.76 15.76L5.38 17.18C5.34 17.38 5.23 17.42 5.03 17.33C3.56 16.65 2.68 14.53 2.68 12.71C2.68 8.38 5.86 4.42 12.29 4.42C17.46 4.42 21.45 8.03 21.45 10.89C21.45 15.91 18.43 19.99 14.09 19.99C12.85 19.99 11.69 19.35 11.3 18.6L10.45 21.75C10.12 22.96 9.28 24.45 8.72 25.36C9.77 25.67 10.87 25.84 12 25.84C17.52 25.84 22 21.36 22 15.84C22 10.32 17.52 5.84 12 5.84V2Z" fill="currentColor"/>
      </svg>
    )
  }
]

const paymentMethods = [
  { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg' },
  { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
  { name: 'American Express', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg' },
  { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.main}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <h3 className={styles.logo}>ANNA PARIS</h3>
            <p className={styles.tagline}>
              Timeless elegance.<br />
              Exceptional craftsmanship.
            </p>
            <div className={styles.social}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className={styles.linksGrid}>
            {/* Shop */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Shop</h4>
              <ul className={styles.linkList}>
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className={styles.link}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>About</h4>
              <ul className={styles.linkList}>
                {footerLinks.about.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className={styles.link}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Customer Care</h4>
              <ul className={styles.linkList}>
                {footerLinks.customerCare.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className={styles.link}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            {/* Copyright & Legal */}
            <div className={styles.legal}>
              <p className={styles.copyright}>
                © {currentYear} Anna Paris Jewelry. All rights reserved.
              </p>
              <div className={styles.legalLinks}>
                <a href="/privacy-policy" className={styles.legalLink}>
                  Privacy Policy
                </a>
                <span className={styles.separator}>·</span>
                <a href="/terms-of-service" className={styles.legalLink}>
                  Terms of Service
                </a>
                <span className={styles.separator}>·</span>
                <a href="/accessibility" className={styles.legalLink}>
                  Accessibility
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className={styles.payments}>
              {paymentMethods.map((method) => (
                <div key={method.name} className={styles.paymentIcon}>
                  <Image
                    src={method.logo}
                    alt={method.name}
                    width={50}
                    height={30}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
