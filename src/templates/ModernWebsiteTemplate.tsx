import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Star, 
  Check, 
  ArrowRight, 
  Play,
  Quote,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Shield,
  Zap,
  Users,
  Award,
  TrendingUp,
  Heart
} from 'lucide-react';

// Color scheme variables (easily customizable)
const colors = {
  primary: '#3B82F6',
  primaryDark: '#1E40AF',
  secondary: '#10B981',
  accent: '#F59E0B',
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

// Typography system
const typography = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
  h3: 'text-2xl md:text-3xl font-bold',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg md:text-xl font-semibold',
  body: 'text-base md:text-lg',
  small: 'text-sm md:text-base',
  caption: 'text-xs md:text-sm'
};

// Spacing system (8px grid)
const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
  '3xl': '6rem',   // 96px
  '4xl': '8rem'    // 128px
};

// Reusable Button Component
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`,
    secondary: `bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500`,
    outline: `border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500`,
    ghost: `text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500`
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Section Container
const Section = ({ children, className = '', background = 'white' }) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-900 text-white'
  };
  
  return (
    <section className={`py-16 md:py-24 ${backgrounds[background]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigation = [
    { name: 'Home', href: '#home' },
    { 
      name: 'Services', 
      href: '#services',
      dropdown: [
        { name: 'Web Design', href: '#web-design' },
        { name: 'Development', href: '#development' },
        { name: 'Consulting', href: '#consulting' }
      ]
    },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ModernSite</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button>Get Started</Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4">
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <Section className="pt-24 pb-16 md:pt-32 md:pb-24" background="gray">
      <div className="text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${typography.h1} text-gray-900 mb-6`}>
            Build Amazing Websites with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Modern Design</span>
          </h1>
          <p className={`${typography.body} text-gray-600 mb-8 max-w-2xl mx-auto`}>
            Create stunning, responsive websites that convert visitors into customers. 
            Our modern templates and components make it easy to build professional sites without coding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto">
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Image/Video Placeholder */}
      <div className="mt-16 max-w-5xl mx-auto">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-700">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-lg font-semibold">Product Demo Video</p>
                <p className="text-sm opacity-75">Click to play</p>
              </div>
            </div>
          </div>
          {/* Floating elements for visual interest */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </Section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance with modern web technologies.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with security best practices and reliable infrastructure.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time collaboration tools.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Deploy worldwide with CDN and multi-region support.'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized for excellence in design and user experience.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Driven',
      description: 'Make data-driven decisions with comprehensive analytics.'
    }
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <h2 className={`${typography.h2} text-gray-900 mb-4`}>
          Why Choose Our Platform?
        </h2>
        <p className={`${typography.body} text-gray-600 max-w-2xl mx-auto`}>
          We provide everything you need to create, manage, and scale your online presence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} hover className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <feature.icon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className={`${typography.h5} text-gray-900 mb-4`}>
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals and small projects',
      features: [
        '5 Projects',
        '10GB Storage',
        'Basic Support',
        'SSL Certificate',
        'Mobile Responsive'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing businesses and teams',
      features: [
        'Unlimited Projects',
        '100GB Storage',
        'Priority Support',
        'Custom Domain',
        'Advanced Analytics',
        'Team Collaboration',
        'API Access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations with advanced needs',
      features: [
        'Everything in Professional',
        '1TB Storage',
        '24/7 Phone Support',
        'White Label Solution',
        'Advanced Security',
        'Custom Integrations',
        'Dedicated Account Manager'
      ],
      popular: false
    }
  ];

  return (
    <Section background="gray">
      <div className="text-center mb-16">
        <h2 className={`${typography.h2} text-gray-900 mb-4`}>
          Simple, Transparent Pricing
        </h2>
        <p className={`${typography.body} text-gray-600 max-w-2xl mx-auto`}>
          Choose the plan that fits your needs. All plans include our core features and 30-day money-back guarantee.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`p-8 relative ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className={`${typography.h4} text-gray-900 mb-2`}>
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.popular ? 'primary' : 'outline'} 
              className="w-full"
            >
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      content: 'This platform transformed how we build and manage our websites. The ease of use and powerful features are unmatched.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Designer, Creative Agency',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      content: 'As a designer, I love the flexibility and control this platform gives me. My clients are always impressed with the results.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      content: 'The analytics and conversion optimization features have significantly improved our marketing campaigns performance.',
      rating: 5
    }
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <h2 className={`${typography.h2} text-gray-900 mb-4`}>
          What Our Customers Say
        </h2>
        <p className={`${typography.body} text-gray-600 max-w-2xl mx-auto`}>
          Join thousands of satisfied customers who trust our platform for their business needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-8">
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <Quote className="w-8 h-8 text-gray-300 mb-4" />
            
            <p className="text-gray-700 mb-6 italic">
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <Section background="dark">
      <div className="text-center">
        <h2 className={`${typography.h2} mb-4`}>
          Ready to Get Started?
        </h2>
        <p className={`${typography.body} text-gray-300 mb-8 max-w-2xl mx-auto`}>
          Join thousands of businesses that trust our platform to power their online presence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100">
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900">
            Schedule Demo
          </Button>
        </div>
      </div>
    </Section>
  );
};

// Footer Component
const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Templates', 'Integrations'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Tutorials'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
  };

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ModernSite</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Building the future of web development with modern tools and beautiful design.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ModernSite. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-gray-400 text-sm">by our team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Template Component
const ModernWebsiteTemplate = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default ModernWebsiteTemplate;