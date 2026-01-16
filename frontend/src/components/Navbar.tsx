import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (lang === "zh") {
      navigate("/zh");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-brand-yellow/20 bg-brand-yellow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="cursor-pointer">
          <img src="/assets/logo.png" alt="Dynasties Capital" className="h-10 md:h-12" />
        </a>
        
        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="/" className="text-base font-semibold text-black hover:opacity-70">About Us</a>
          <a href="/our-value" className="text-base font-semibold text-black hover:opacity-70">Our Value</a>
          <a href="/why-exclusive-licensing" className="text-base font-semibold text-black hover:opacity-70">Why Exclusive Licensing</a>
          <a href="/portfolio" className="text-base font-semibold text-black hover:opacity-70">Portfolio</a>
          <a href="/#contact" className="text-base font-semibold text-black hover:opacity-70">Contact Us</a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-brand-yellow border-t border-black/10 px-6 py-4 space-y-4">
          <a 
            href="/" 
            className="block text-base font-semibold text-black hover:opacity-70"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </a>
          <a 
            href="/our-value" 
            className="block text-base font-semibold text-black hover:opacity-70"
            onClick={() => setIsMenuOpen(false)}
          >
            Our Value
          </a>
          <a 
            href="/why-exclusive-licensing" 
            className="block text-base font-semibold text-black hover:opacity-70"
            onClick={() => setIsMenuOpen(false)}
          >
            Why Exclusive Licensing
          </a>

          <a 
            href="/portfolio" 
            className="block text-base font-semibold text-black hover:opacity-70"
            onClick={() => setIsMenuOpen(false)}
          >
            Portfolio
          </a>

          <a 
            href="/#contact" 
            className="block text-base font-semibold text-black hover:opacity-70"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </a>

        </div>
      </div>
    </nav>
  );
}