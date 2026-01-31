'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img
            src="/logo.svg"
            alt="Terminus Logo"
            className={styles.logo}
          />
        </Link>
      </div>

      <div className={styles.navLinks}>
        <Link href="/contact-us" className={`${styles.navLink} ${styles.contactNavBtn}`}>
          Contact Us
        </Link>
        <Link href="/request-advance-purchase-indication" className={styles.navLink}>
          Request Advance Purchase Indication
        </Link>
      </div>

      {/* Hamburger Menu for Mobile */}
      <button
        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
        aria-label="Toggle navigation menu"
        onClick={toggleMenu}
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.active : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
        <Link href="/contact-us" className={styles.mobileMenuLink} onClick={closeMenu}>
          Contact Us
        </Link>
        <Link
          href="/request-advance-purchase-indication"
          className={styles.mobileMenuLink}
          onClick={closeMenu}
        >
          Request Advance Purchase Indication
        </Link>
      </div>
    </nav>
  );
}
