import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
  Clock,
  ChevronRight,
  BatteryCharging,
  LineChart,
  Timer,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AB2511Deadline, calculateCountdown } from "@/lib/countdown";

export default function MarketingLanding() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Countdown to AB 2511 deadline
  const [countdown, setCountdown] = useState(calculateCountdown(AB2511Deadline));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(AB2511Deadline));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
  
  // Handle login/entry based on role
  const handleClientEntry = () => {
    navigate("/role-select");
  };
  
  const handleAdminEntry = () => {
    navigate("/role-select");
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">EverGrid</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-primary">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary">How It Works</a>
            <a href="#compliance" className="text-sm text-gray-600 hover:text-primary">AB 2511</a>
            <a href="#portals" className="text-sm text-gray-600 hover:text-primary">Portals</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button asChild variant="default">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:flex">
                  <Link href="/role-select">Log in</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/role-select">Get Started</Link>
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
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{countdown.days} days until AB 2511 deadline</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                <span className="block">Your complete platform for</span>
                <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  AB 2511 compliance
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg">
                Streamline your backup power planning and compliance process with the only platform created specifically for California SNFs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-white font-medium"
                  onClick={handleClientEntry}
                >
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <a href="#how-it-works">Learn More</a>
                </Button>
              </div>
              
              <div className="pt-4">
                <p className="flex items-center text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Already helping 350+ Skilled Nursing Facilities
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
                      <h3 className="text-2xl font-bold text-gray-900">Mobile Lightning</h3>
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
      
      {/* Features section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Key Features
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Everything you need to achieve and maintain AB 2511 compliance
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
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={itemAnimation}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compliance Dashboard</h3>
              <p className="text-gray-600">
                Track your facility's progress with an intuitive dashboard showing key deadlines and requirements.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={itemAnimation}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <BatteryCharging className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Microgrid Assessment</h3>
              <p className="text-gray-600">
                Calculate your facility's exact power needs with our specialized assessment tools.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={itemAnimation}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Financial Analysis</h3>
              <p className="text-gray-600">
                Compare costs between diesel generators and battery solutions with detailed ROI calculators.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={itemAnimation}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Document Management</h3>
              <p className="text-gray-600">
                Organize and store all compliance documentation in one secure, accessible location.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={itemAnimation}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Timer className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Implementation Timeline</h3>
              <p className="text-gray-600">
                Step-by-step guidance with customized timelines for your facility's compliance journey.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              variants={itemAnimation}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Admin Oversight</h3>
              <p className="text-gray-600">
                Comprehensive administrative tools for managing multiple facilities and tracking progress.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* How EverGrid Works section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-white">
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
              Your complete guide to achieving AB 2511 compliance
            </motion.p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Connection line */}
            <div className="absolute top-24 left-1/2 w-0.5 h-[calc(100%-6rem)] bg-primary/20 -translate-x-1/2 hidden md:block"></div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
              variants={containerAnimation}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Step 1 */}
              <motion.div variants={itemAnimation} className="md:text-right">
                <div className="flex md:justify-end">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary relative">
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Assessment</h3>
                <p className="text-gray-600">
                  Upload utility bills and facility information to get a complete power needs assessment.
                </p>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="md:mt-64">
                <div className="md:hidden w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary relative">
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
                  <FileText className="h-6 w-6" />
                </div>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div variants={itemAnimation} className="md:-mt-64">
                <div className="hidden md:flex">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary relative">
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Planning</h3>
                <p className="text-gray-600">
                  Review customized backup power options including costs, timelines, and implementation details.
                </p>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="md:text-right md:mt-64">
                <div className="md:hidden w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary relative">
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">3</span>
                  <Cpu className="h-6 w-6" />
                </div>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div variants={itemAnimation} className="md:-mt-64">
              </motion.div>
              
              <motion.div variants={itemAnimation} className="md:text-right">
                <div className="flex md:justify-end">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary relative">
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">3</span>
                    <Cpu className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Implementation</h3>
                <p className="text-gray-600">
                  Track deployment progress, manage documentation, and ensure complete compliance with all requirements.
                </p>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="mt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                variant="default" 
                size="lg"
                className="font-medium"
                onClick={handleClientEntry}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* AB 2511 Section */}
      <section id="compliance" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-primary/10 inline-block px-3 py-1 rounded-md text-primary text-sm font-medium mb-4">
                California Assembly Bill 2511
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Understanding AB 2511 Compliance
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  AB 2511 requires all skilled nursing facilities in California to install backup power systems 
                  capable of powering critical functions for at least 96 hours during emergencies by January 1, 2026.
                </p>
                <p>
                  Compliance requires careful planning, significant investment, and proper documentation to 
                  ensure your facility meets all requirements on time.
                </p>
                
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        The deadline for compliance is approaching. Only <strong>{countdown.days} days</strong> remain 
                        to plan, budget, and implement your solution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  variant="default"
                  className="font-medium"
                  onClick={handleClientEntry}
                >
                  Assess Your Facility
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-md"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Requirements</h3>
              <ul className="space-y-4">
                {[
                  "Minimum 96-hour backup power capacity for critical functions",
                  "Support for HVAC and temperature control systems",
                  "Reliable power for medical equipment and refrigeration",
                  "Regular testing and maintenance requirements",
                  "Comprehensive documentation of compliance",
                  "Staff training on backup power operations"
                ].map((requirement, index) => (
                  <li key={`requirement-${index}`} className="flex">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Non-Compliance Penalties</h3>
                <p className="text-gray-600 mb-4">
                  Facilities that fail to comply by the deadline may face:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <div className="text-red-500 mr-2">•</div>
                    <span>Significant monetary fines</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-red-500 mr-2">•</div>
                    <span>Licensing restrictions or probation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-red-500 mr-2">•</div>
                    <span>Mandatory public disclosure of non-compliance</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Portal Cards section */}
      <section id="portals" className="py-24 bg-gradient-to-br from-gray-50 to-white">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
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
                    className="w-full group"
                    onClick={handleClientEntry}
                  >
                    <span className="flex items-center">
                      Enter as Facility Staff
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group"
                    asChild
                  >
                    <Link href="/registration/welcome">
                      <span className="flex items-center">
                        New Registration
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Admin Portal Card */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Admin Portal</h3>
                <p className="mt-2 text-gray-600">
                  For EverGrid administrators and consultants
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  {[
                    "Multi-facility Overview",
                    "Compliance Analytics",
                    "User Management",
                    "Deployment Tracking",
                    "Reporting Tools"
                  ].map((feature, index) => (
                    <li key={`admin-feature-${index}`} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Button 
                    variant="outline" 
                    className="w-full group"
                    onClick={handleAdminEntry}
                  >
                    <span className="flex items-center">
                      Enter as Administrator
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
            
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">EverGrid</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete platform for AB 2511 compliance and backup power solutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#compliance" className="text-gray-400 hover:text-white transition-colors">AB 2511</a></li>
                <li><a href="#portals" className="text-gray-400 hover:text-white transition-colors">Portals</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AB 2511 Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@evergrid.com</li>
                <li>(800) 555-1234</li>
                <li>123 Energy Way<br />Sacramento, CA 95814</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} EverGrid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}