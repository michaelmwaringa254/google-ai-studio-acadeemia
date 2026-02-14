

import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import path for react-router-dom.
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartContext';
import { addNewsletterSubscriber } from '../db';

// Tawk.to TypeScript declarations
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const NavLink: React.FC<{ to: string; children: React.ReactNode, onClick?: () => void, className?: string }> = ({ to, children, onClick, className }) => {
  const activeStyle = {
    color: '#5D5FEF',
    fontWeight: 600,
  };

  return (
    <RouterNavLink 
      to={to} 
      onClick={onClick}
      className={`text-text-primary dark:text-gray-200 hover:text-primary transition-colors duration-300 font-medium ${className}`}
      style={({ isActive }) => (isActive ? activeStyle : undefined)}
    >
      {children}
    </RouterNavLink>
  );
};

const HamburgerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
    const [isCompanyDropdownOpen, setCompanyDropdownOpen] = useState(false);
    const [isMobileProductOpen, setMobileProductOpen] = useState(false);
    const [isMobileCompanyOpen, setMobileCompanyOpen] = useState(false);

  const productDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);  
  const companyDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { theme } = useTheme();
    const { cart } = useCart();
    const logoLight = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-light.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tbGlnaHQucG5nIiwiaWF0IjoxNzU2NzU2NzkzLCJleHAiOjMzMjkyNzU2NzkzfQ.4sLXHZ9j2o5OpP6lSjYHzGEXYU_-hPkHmZJ1zjETiQI';
    const logoDark = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-dark.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tZGFyay5wbmciLCJpYXQiOjE3NTY3NTY3NjgsImV4cCI6MzMyOTI3NTY3Njh9.XpJbMk19-pJLNUoRSWyNbWDjvn4sUH9CmqOhAyxmzi0';
    const logoSrc = theme === 'light' ? logoLight : logoDark;

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setMobileProductOpen(false);
        setMobileCompanyOpen(false);
    }

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (productDropdownTimeoutRef.current) {
                clearTimeout(productDropdownTimeoutRef.current);
            }
            if (companyDropdownTimeoutRef.current) {
                clearTimeout(companyDropdownTimeoutRef.current);
            }
        };
    }, []);

    return (
      <header className="bg-background/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logoSrc} alt="Acadeemia Logo" className="h-10 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center space-x-8">
            <div 
              className="relative" 
              onMouseEnter={() => {
                // Clear previous timeout if any
                if (productDropdownTimeoutRef.current) {
                  clearTimeout(productDropdownTimeoutRef.current);
                  productDropdownTimeoutRef.current = null;
                }
                setProductDropdownOpen(true);
                setCompanyDropdownOpen(false);
            }}
            onMouseLeave={() => {
              // Set delay before closing
              productDropdownTimeoutRef.current = setTimeout(() => {
                setProductDropdownOpen(false);
              }, 300); // same 300ms delay as company
            }}
        >

                <button 
                    className="flex items-center text-text-primary dark:text-gray-200 hover:text-primary transition-colors duration-300 font-medium"
                >
                    Product
                    <svg className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isProductDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isProductDropdownOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-20">
                        <Link to="/modules" onClick={() => setProductDropdownOpen(false)} className="block px-4 py-2 text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Modules</Link>
                        <Link to="/versions" onClick={() => setProductDropdownOpen(false)} className="block px-4 py-2 text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Deployment</Link>
                        <Link to="/msp" onClick={() => setProductDropdownOpen(false)} className="block px-4 py-2 text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">MSP</Link>
                    </div>
                )}
            </div>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/demo">Demo</NavLink>
            <NavLink to="/store">Store</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <div
                className="relative"
                onMouseEnter={() => {
                    if (companyDropdownTimeoutRef.current) {
                        clearTimeout(companyDropdownTimeoutRef.current);
                        companyDropdownTimeoutRef.current = null;
                    }
                    setCompanyDropdownOpen(true);
                    setProductDropdownOpen(false);
                }}
                onMouseLeave={() => {
                    companyDropdownTimeoutRef.current = setTimeout(() => {
                        setCompanyDropdownOpen(false);
                    }, 300); // 300ms delay
                }}
            >
                <button 
                    className="flex items-center text-text-primary dark:text-gray-200 hover:text-primary transition-colors duration-300 font-medium"
                >
                    Company
                    <svg className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isCompanyDropdownOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 z-20">
                        <Link to="/about" onClick={() => setCompanyDropdownOpen(false)} className="block px-4 py-2 text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">About Us</Link>
                        <Link to="/why-acadeemia" onClick={() => setCompanyDropdownOpen(false)} className="block px-4 py-2 text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Why Acadeemia?</Link>
                        <Link to="/affiliate-picks" onClick={() => setCompanyDropdownOpen(false)} className="block px-4 py-2 text-text-primary dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Affiliate Picks</Link>
                    </div>
                )}
            </div>
            <NavLink to="/contact">Contact Us</NavLink>
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/cart" className="relative text-text-primary dark:text-gray-200 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>}
            </Link>
            <Link to="/login" className="text-text-primary dark:text-gray-200 font-semibold hover:text-primary transition-colors">
              Log In
            </Link>
            <Link to="/demo" className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-hover transition-all duration-300 shadow-md">
              Request a Demo
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
              <ThemeToggle />
              <Link to="/cart" className="relative text-text-primary dark:text-gray-200 hover:text-primary transition-colors ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-4 text-text-primary dark:text-gray-200" aria-label="Toggle menu">
                {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
              </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background dark:bg-gray-900 absolute top-full left-0 w-full shadow-lg border-t border-gray-200 dark:border-gray-800 max-h-[calc(100vh-80px)] overflow-y-auto">
             <div className="px-6 py-4 space-y-3">
                {/* Mobile product dropdown */}
                <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                    <button onClick={() => setMobileProductOpen(!isMobileProductOpen)} className="w-full flex justify-between items-center text-text-primary dark:text-gray-200 hover:text-primary transition-colors duration-300 font-medium py-2">
                        Product
                        <svg className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isMobileProductOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {isMobileProductOpen && (
                        <div className="pl-4 pt-3 pb-2 space-y-3">
                             <Link to="/modules" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors py-1">Modules</Link>
                             <Link to="/versions" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors py-1">Deployment</Link>
                             <Link to="/msp" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors py-1">MSP</Link>
                        </div>
                    )}
                </div>

                <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/pricing" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors font-medium">Pricing</Link>
                </div>

                <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/demo" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors font-medium">Demo</Link>
                </div>

                <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/store" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors font-medium">Store</Link>
                </div>

                <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/blog" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors font-medium">Blog</Link>
                </div>

                 {/* Mobile company dropdown */}
                <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                    <button onClick={() => setMobileCompanyOpen(!isMobileCompanyOpen)} className="w-full flex justify-between items-center text-text-primary dark:text-gray-200 hover:text-primary transition-colors duration-300 font-medium py-2">
                        Company
                         <svg className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isMobileCompanyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    {isMobileCompanyOpen && (
                        <div className="pl-4 pt-3 pb-2 space-y-3">
                            <Link to="/about" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors py-1">About Us</Link>
                            <Link to="/why-acadeemia" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors py-1">Why Acadeemia?</Link>
                            <Link to="/affiliate-picks" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors py-1">Affiliate Picks</Link>
                        </div>
                    )}
                </div>

                <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                    <Link to="/contact" onClick={closeAllMenus} className="block text-text-primary dark:text-gray-200 hover:text-primary transition-colors font-medium">Contact Us</Link>
                </div>

                <div className="pt-4 pb-2 space-y-3">
                     <Link to="/login" onClick={closeAllMenus} className="block text-center text-text-primary dark:text-gray-200 font-semibold hover:text-primary transition-colors py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                        Log In
                    </Link>
                    <Link to="/demo" onClick={closeAllMenus} className="block w-full text-center bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                        Request a Demo
                    </Link>
                </div>
            </div>
          </div>
        )}
      </header>
    );
};

// --- Social Icons for Footer ---
const FacebookIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const InstagramIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.314.935 20.644.522 19.854.218 19.09.083 18.22.015 16.947 0 15.667 0 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.056 1.17-.25 1.805-.414 2.227-.218.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.056-1.816-.25-2.236-.414-.562-.218-.96-.479-1.381-.897-.419-.419-.69-.824-.896-1.38-.165-.42-.359-1.065-.413-2.235-.057-1.274-.07-1.649-.07-4.859 0-3.211.015-3.586.07-4.859.056-1.171.25-1.816.414-2.236.218-.562.479-.96.896-1.381.42-.419.81-.69 1.38-.896.42-.165 1.065-.359 2.236-.413 1.274-.057 1.649-.07 4.859-.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>;
const LinkedinIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>;
const TikTokIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>TikTok</title><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
const YoutubeIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

const SocialLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary dark:hover:text-gray-200 transition-colors">
        {children}
    </a>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const logoLight = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-light.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tbGlnaHQucG5nIiwiaWF0IjoxNzU2NzU2NzkzLCJleHAiOjMzMjkyNzU2NzkzfQ.4sLXHZ9j2o5OpP6lSjYHzGEXYU_-hPkHmZJ1zjETiQI';
  const logoDark = 'https://oqasxrkbosdqaldwydeu.supabase.co/storage/v1/object/sign/website_images/logo/logo-dark.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNWYwZjU5NS00NmQxLTRkOTctYTMxMS1lMmMxMTcyMzEyODUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlX2ltYWdlcy9sb2dvL2xvZ28tZGFyay5wbmciLCJpYXQiOjE3NTY3NTY3NjgsImV4cCI6MzMyOTI3NTY3Njh9.XpJbMk19-pJLNUoRSWyNbWDjvn4sUH9CmqOhAyxmzi0';
  const logoSrc = theme === 'light' ? logoLight : logoDark;


  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }
    try {
      await addNewsletterSubscriber({ email, name: name || null });
      setMessage('Thank you for subscribing!');
      setEmail('');
      setName('');
    } catch (error: any) {
      // Supabase might throw an error if the email is a duplicate (due to UNIQUE constraint)
      if (error.message.includes('duplicate key value violates unique constraint')) {
        setMessage('This email is already subscribed.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } finally {
        setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <footer className="bg-secondary dark:bg-gray-800/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src={logoSrc} alt="Acadeemia Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-text-secondary dark:text-gray-400">The complete school management solution for modern educational institutions.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-text-secondary dark:text-gray-400 hover:text-primary">About Us</Link></li>
              <li><Link to="/pricing" className="text-text-secondary dark:text-gray-400 hover:text-primary">Pricing</Link></li>
              <li><Link to="/contact" className="text-text-secondary dark:text-gray-400 hover:text-primary">Contact</Link></li>
              <li><Link to="/blog" className="text-text-secondary dark:text-gray-400 hover:text-primary">Blog</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/faqs" className="text-text-secondary dark:text-gray-400 hover:text-primary">FAQs</Link></li>
              <li><Link to="/careers" className="text-text-secondary dark:text-gray-400 hover:text-primary">Careers</Link></li>
              <li><Link to="/help-center" className="text-text-secondary dark:text-gray-400 hover:text-primary">Help Center</Link></li>
              <li><Link to="/testimonials" className="text-text-secondary dark:text-gray-400 hover:text-primary">Testimonials</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms-of-service" className="text-text-secondary dark:text-gray-400 hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-text-secondary dark:text-gray-400 hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">Stay Updated</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name" 
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
                Subscribe
              </button>
              {message && <p className="text-sm mt-2">{message}</p>}
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary dark:text-gray-400 text-sm">&copy; {new Date().getFullYear()} Acadeemia. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <SocialLink href="https://www.instagram.com/acadeemia_sms/"><InstagramIcon /></SocialLink>
            <SocialLink href="https://www.linkedin.com/company/acadeemia/"><LinkedinIcon /></SocialLink>
            <SocialLink href="https://www.tiktok.com/@acadeemia_sms"><TikTokIcon /></SocialLink>
            <SocialLink href="https://www.youtube.com/@ACADEEMIA/videos"><YoutubeIcon /></SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add Tawk.to chat widget
  React.useEffect(() => {
    // Check if Tawk_API is already loaded to avoid duplicate scripts
    if (window.Tawk_API) return;

    // Create and inject Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/6675ca039d7f358570d2188d/1i0u1q7vk';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Clean up Tawk_API
      if (window.Tawk_API && window.Tawk_API.hide) {
        window.Tawk_API.hide();
      }
    };
  }, []);

  return (
    <div className="bg-background dark:bg-gray-900 text-text-primary dark:text-gray-200">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;