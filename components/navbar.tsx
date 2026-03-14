'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '首页', href: '#hero' },
    { label: '规则', href: '#rules' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`glass-strong mx-4 rounded-xl border border-glass-border transition-all duration-500 ${scrolled ? 'shadow-lg shadow-primary/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#hero" className="flex-shrink-0 group">
              <span className="text-2xl font-bold glow-text transition-all duration-300 group-hover:scale-110 inline-block">CGSBS</span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline gap-2">
                {navItems.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-primary/20 focus:outline-none transition-all duration-300 hover:scale-110"
              >
                <span className="sr-only">打开菜单</span>
                {isOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 border-t border-glass-border' : 'max-h-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
                onClick={() => setIsOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
