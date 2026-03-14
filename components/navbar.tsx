'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: '首页', href: '#' },
    { label: '规则', href: '#rules' },
    { label: '地图', href: '#map' },
    { label: '皮肤站', href: '#skins' },
    { label: '充值中心', href: '#shop' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-strong mx-4 mt-4 rounded-xl border border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold glow-text">CGSBS</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
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
                className="inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-primary/20 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-glass-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
