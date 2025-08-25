import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Rocket,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


// --- Navigation Links ---
const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Contact", href: "/contact" },
];

// --- Features Section Data ---
const features = [
  {
    title: "Lightning Fast",
    description: "Experience unmatched speed and responsiveness with TrenPH's advanced infrastructure.",
    icon: Zap,
  },
  {
    title: "Secure by Design",
    description: "Your data and transactions are protected with top-tier security protocols.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Dashboard",
    description: "Monitor, control, and analyze everything with an intuitive dashboard built for efficiency.",
    icon: LayoutDashboard,
  },
  {
    title: "Future Ready",
    description: "TrenPH evolves with technology to ensure you're always ahead of the curve.",
    icon: Rocket,
  },
];

// --- Homepage Component ---
export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={28} />
            <span className="font-bold text-2xl text-gray-800">TrenPH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <Button asChild className="hidden md:flex bg-indigo-600 hover:bg-indigo-700">
            <Link to="/get-started">Get Started</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <nav className="flex flex-col items-center gap-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <Link to="/get-started">Get Started</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between container mx-auto px-6 mt-24 md:mt-32">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            Discover the Future of <span className="text-indigo-600">TrenPH</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Elevate your experience with our cutting-edge platform designed for speed,
            security, and innovation. TrenPH is here to set new standards.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/get-started" className="flex items-center gap-2">
              Get Started <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>

        {/* Hero Image */}
        <motion.img
          src="/images/hero-illustration.svg"
          alt="TrenPH Illustration"
          className="w-full max-w-md mt-10 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20 mt-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose TrenPH?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <feature.icon className="text-indigo-600 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Phone className="text-indigo-600" size={28} />
              <div>
                <p className="font-semibold text-gray-800">Call Us</p>
                <p className="text-gray-600">+63 912 345 6789</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-indigo-600" size={28} />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">support@trenph.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-indigo-600" size={28} />
              <div>
                <p className="font-semibold text-gray-800">Visit Us</p>
                <p className="text-gray-600">123 TrenPH Street, Manila</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p>© {new Date().getFullYear()} TrenPH. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-white">Privacy Policy</Link>
            <Link to="/" className="hover:text-white">Terms</Link>
            <Link to="/" className="hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
