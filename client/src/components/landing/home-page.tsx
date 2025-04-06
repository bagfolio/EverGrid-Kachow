import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  BarChart3,
  Calendar, 
  FileText, 
  Shield, 
  Cpu, 
  Building2, 
  Users, 
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AB2511Deadline } from "@/lib/countdown";
import { calculateCountdown } from "@/lib/countdown";

export function HomePage() {
  const { user } = useAuth();
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Countdown to AB 2511 deadline
  const countdown = calculateCountdown(AB2511Deadline);
  
  // Container animation
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Card hover animation
  const cardHoverAnimation = {
    rest: { 
      scale: 1, 
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
      y: 0
    },
    hover: { 
      scale: 1.03, 
      boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
      y: -5
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with navigation */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">EverGrid</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button asChild variant="default">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/auth">Log in</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/auth?tab=register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{countdown.days} days until AB 2511 deadline</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                <span className="block">Effortless AB 2511</span>
                <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Compliance Solutions
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg">
                Meet your 2026 deadline with confidence and streamline energy management for your Skilled Nursing Facility.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="text-white font-medium"
                >
                  <Link href="/auth?tab=register">
                    Get Started 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                >
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
              
              <div className="pt-4">
                <p className="flex items-center text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Trusted by over 350 Skilled Nursing Facilities
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-primary/30 rounded-2xl overflow-hidden shadow-xl">
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ 
                    background: [
                      "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, rgba(255, 255, 255, 0) 50%)",
                      "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
                      "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, rgba(255, 255, 255, 0) 50%)"
                    ]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                >
                  <div className="text-center p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                      }}
                      transition={{ 
                        delay: 0.5, 
                        duration: 0.8 
                      }}
                    >
                      <Zap className="w-16 h-16 mx-auto text-primary mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900">Secure Backup Power</h3>
                      <p className="mt-2 text-gray-600 max-w-md mx-auto">
                        Ensure uninterrupted care with microgrid solutions designed specifically for healthcare facilities
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Animated elements */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">AB 2511 Compliant</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Meet 2026 Deadline</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </section>
      
      {/* How EverGrid Works section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How EverGrid Works
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              A comprehensive platform to guide you through AB 2511 compliance
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="flex flex-col items-center text-center p-6"
              variants={itemAnimation}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Assess</h3>
              <p className="text-gray-600">
                Evaluate your facility's power needs and current situation with detailed analysis tools.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6"
              variants={itemAnimation}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Plan</h3>
              <p className="text-gray-600">
                Design a customized microgrid solution based on facility requirements and compliance needs.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center p-6"
              variants={itemAnimation}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Implement</h3>
              <p className="text-gray-600">
                Deploy microgrid solutions with expert support and continuous monitoring for compliance.
              </p>
            </motion.div>
          </motion.div>
          
          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                asChild 
                variant="default" 
                size="lg"
                className="font-medium"
              >
                <Link href="/auth?tab=register">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Portal Cards section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Choose Your Portal
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Dedicated interfaces for facility staff and administrators
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Facility Portal Card */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              variants={cardHoverAnimation}
              initial="rest"
              whileHover="hover"
              animate={hovered === "facility" ? "hover" : "rest"}
              onMouseEnter={() => setHovered("facility")}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Facility Portal</h3>
                <p className="mt-2 text-gray-600">
                  For skilled nursing facility staff managing compliance
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  {[
                    "Compliance Dashboard",
                    "Energy Assessment Tools",
                    "Documentation Manager",
                    "Financial ROI Calculator",
                    "Implementation Timeline"
                  ].map((feature, index) => (
                    <li key={`facility-feature-${index}`} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 space-y-3">
                  <Button 
                    asChild 
                    className="w-full"
                  >
                    <Link href="/auth?tab=login">
                      Enter as Facility Staff
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full"
                  >
                    <Link href="/auth?tab=register">
                      New Registration
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Admin Portal Card */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              variants={cardHoverAnimation}
              initial="rest"
              whileHover="hover"
              animate={hovered === "admin" ? "hover" : "rest"}
              onMouseEnter={() => setHovered("admin")}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <Shield className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Admin Portal</h3>
                <p className="mt-2 text-gray-600">
                  For system administrators managing multiple facilities
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  {[
                    "Multi-facility Management",
                    "Progress Monitoring Dashboard",
                    "User Account Administration",
                    "Geographic Visualization",
                    "Compliance Reporting"
                  ].map((feature, index) => (
                    <li key={`admin-feature-${index}`} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 space-y-3">
                  <Button 
                    asChild 
                    variant="secondary"
                    className="w-full"
                  >
                    <Link href="/auth?tab=login">
                      Enter as Administrator
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full"
                  >
                    <Link href="/auth?tab=register">
                      Request Admin Access
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Getting Started Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How to Get Started
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Be compliant in three simple steps
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={containerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="relative"
              variants={itemAnimation}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold z-10">
                1
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full relative z-0 pl-8">
                <h3 className="text-xl font-bold mt-3 mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Register on EverGrid and set up your facility profile with basic information.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={itemAnimation}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold z-10">
                2
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full relative z-0 pl-8">
                <h3 className="text-xl font-bold mt-3 mb-2">Enter Facility Details</h3>
                <p className="text-gray-600">
                  Upload utility bills and facility data for a comprehensive energy assessment.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={itemAnimation}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold z-10">
                3
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full relative z-0 pl-8">
                <h3 className="text-xl font-bold mt-3 mb-2">Launch Dashboard</h3>
                <p className="text-gray-600">
                  Access your compliance dashboard to track progress and receive customized guidance.
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                asChild 
                variant="default" 
                size="lg"
                className="font-medium"
              >
                <Link href="/auth?tab=register">
                  Create Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Social Proof Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between p-8 rounded-xl bg-white shadow-sm max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900">
                Trusted by over 350 Skilled Nursing Facilities
              </h3>
              <p className="text-gray-600 mt-2">
                Join California's leading SNFs in achieving AB 2511 compliance
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <div className="inline-flex items-center gap-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-gray-500">350+ Registered Facilities</span>
              </div>
              <div className="inline-flex items-center gap-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-500">100% Compliance Success Rate</span>
              </div>
              <div className="inline-flex items-center gap-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-gray-500">{countdown.days} Days Until Deadline</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to ensure AB 2511 compliance?
          </motion.h2>
          
          <motion.p 
            className="text-xl opacity-90 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Create your account today and start your journey toward full compliance and reliable backup power.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="text-primary font-medium text-lg px-8"
            >
              <Link href="/auth?tab=register">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">EverGrid</span>
              </div>
              <p className="text-sm">
                Helping California's SNFs achieve AB 2511 compliance with reliable backup power solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                <li><Link href="/auth?tab=register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/auth?tab=login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">AB 2511 Information</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span>support@evergrid.com</span>
                </li>
                <li className="flex items-center">
                  <span>(800) 555-1234</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EverGrid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}