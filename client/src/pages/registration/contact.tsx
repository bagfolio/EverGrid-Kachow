import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Building2, CheckCircle2 } from "lucide-react";

// Form validation schema
const contactFormSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Please enter a valid business email"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9-+() ]+$/, "Please enter a valid phone number"),
  role: z.string({
    required_error: "Please select a role",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Field validation animations
  const [validFields, setValidFields] = useState<Record<string, boolean>>({
    organizationName: false,
    contactName: false,
    email: false,
    phone: false,
    role: false,
  });

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      organizationName: "",
      contactName: "",
      email: "",
      phone: "",
      role: "",
    },
    mode: "onChange",
  });

  // Watch form values to update validation status
  const formValues = form.watch();
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  // Handle form submission
  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate saving data
    setTimeout(() => {
      // Store in localStorage for later steps
      localStorage.setItem("registration_contact", JSON.stringify(data));
      
      // Navigate to next step
      setLocation("/registration/facility-type");
    }, 800);
  };

  // Update valid fields status
  const updateValidField = (name: string, isValid: boolean) => {
    setValidFields(prev => ({
      ...prev,
      [name]: isValid
    }));
  };

  // Check if all required fields are filled to enable continue button
  const isFormFilled = 
    formValues.organizationName && 
    formValues.contactName && 
    formValues.email && 
    formValues.phone && 
    formValues.role;

  // Skip to utility bill upload page for demo purposes
  const handleSkip = () => {
    // Auto-login as client and redirect to utility bill upload page
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'client',
        password: 'password123',
      }),
    })
    .then(response => {
      if (response.ok) {
        setLocation("/utility-bill-upload");
      } else {
        setLocation("/auth"); // Fallback to auth if auto-login fails
      }
    })
    .catch(error => {
      console.error('Auto-login error:', error);
      setLocation("/auth"); // Fallback to auth if auto-login fails
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-background to-secondary/10 flex flex-col items-center justify-center p-4">
      {/* Skip button for demo purposes */}
      <Button 
        className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 text-primary shadow-sm" 
        size="sm"
        onClick={handleSkip}
      >
        Skip to Bill Upload
      </Button>
      
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-2xl">Contact Information</CardTitle>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter organization name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateValidField("organizationName", e.target.value.length >= 2);
                          }}
                          className={validFields.organizationName ? "pr-10 border-green-500 focus-visible:ring-green-500" : ""}
                        />
                        {validFields.organizationName && (
                          <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="First and last name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            updateValidField("contactName", e.target.value.length >= 2);
                          }}
                          className={validFields.contactName ? "pr-10 border-green-500 focus-visible:ring-green-500" : ""}
                        />
                        {validFields.contactName && (
                          <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="name@company.com"
                            type="email"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              updateValidField("email", emailRegex.test(e.target.value));
                            }}
                            className={validFields.email ? "pr-10 border-green-500 focus-visible:ring-green-500" : ""}
                          />
                          {validFields.email && (
                            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="(555) 123-4567"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value);
                              field.onChange(formatted);
                              updateValidField("phone", formatted.replace(/[^0-9]/g, "").length >= 10);
                            }}
                            className={validFields.phone ? "pr-10 border-green-500 focus-visible:ring-green-500" : ""}
                          />
                          {validFields.phone && (
                            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Title</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateValidField("role", !!value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <SelectTrigger className={validFields.role ? "border-green-500 focus:ring-green-500" : ""}>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Facility Manager">Facility Manager</SelectItem>
                        <SelectItem value="Operations Director">Operations Director</SelectItem>
                        <SelectItem value="Energy Manager">Energy Manager</SelectItem>
                        <SelectItem value="Sustainability Lead">Sustainability Lead</SelectItem>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="h-4">
                {/* Spacing element */}
              </div>
              
              <CardFooter className="flex justify-between px-0 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={!isFormFilled || isSubmitting}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-sm text-muted-foreground text-center">
        <p>© {new Date().getFullYear()} EverGrid - AB 2511 Compliance Platform</p>
      </div>
    </div>
  );
}