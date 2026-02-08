"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/" },
    { name: "Programs", href: "/" },
    { name: "News", href: "/" },
    { name: "Gallery", href: "/" },
    { name: "Contact", href: "/" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image 
                src="/images/alumni-hero.jpg" // Ensure your logo is in public/logo.png
                alt="Happy Life Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:block text-xl font-extrabold text-indigo-700 leading-tight">
              SHERGOSA <br />
              <span className="text-green-600 text-sm font-bold uppercase tracking-widest">SOS Hermann Gmeiner Old Students' Association</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-6 font-semibold text-gray-600">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="hover:text-green-600 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Call to Action Button */}
            {/* <Link 
              href="/login" 
              className="bg-green-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-green-700 transition-all shadow-md active:scale-95"
            >
              Join Us
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div 
        className={`lg:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-2xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6 flex flex-col h-full">
          <button 
            className="self-end text-2xl mb-8 text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
          
          <div className="flex flex-col space-y-4 font-bold text-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg hover:text-green-600 border-b pb-2 border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* <Link
              href="/register"
              className="bg-indigo-600 text-white text-center py-3 rounded-xl mt-4"
              onClick={() => setIsOpen(false)}
            >
              Register Now
            </Link> */}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}