import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

// Define schema for the contact form
const contactFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  requirements: z.string().optional().or(z.literal("")),
  marketingConsent: z.boolean().default(false).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      location: "",
      requirements: "",
      marketingConsent: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest("POST", "/api/inquiries", {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email || undefined,
        location: data.location || undefined,
        requirements: data.requirements || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: t("contact.successTitle"),
        description: t("contact.successDescription"),
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: t("contact.errorTitle"),
        description: error.message || t("contact.errorDescription"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutate(data);
  };

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, href: "#" },
    { icon: <Instagram className="h-4 w-4" />, href: "#" },
    { icon: <Twitter className="h-4 w-4" />, href: "#" },
    { icon: <Youtube className="h-4 w-4" />, href: "#" },
  ];

  return (
    <>
      <Helmet>
        <title>{t("seo.contact.title")} | BuildMyHome</title>
        <meta name="description" content={t("seo.contact.description")} />
        <html lang={language} />
      </Helmet>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">
              {t("contact.pageTitle")}
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t("contact.pageDescription")}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
                  {t("contact.getInTouch")}
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.fullName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.phoneNumber")}</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.form.email")}</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.form.location")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.form.requirements")}</FormLabel>
                          <FormControl>
                            <Textarea rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="marketingConsent"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              {t("contact.form.marketingConsent")}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isPending}
                    >
                      {isPending ? t("contact.form.submitting") : t("contact.form.submitInquiry")}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Contact Information */}
              <div>
                <div className="bg-primary-700 text-white rounded-xl p-6 md:p-8 mb-8">
                  <h2 className="font-heading font-semibold text-2xl mb-6">
                    {t("contact.contactInformation")}
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-primary-600 rounded-full p-2 mr-4 mt-1">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">
                          {t("contact.officeAddress")}
                        </h3>
                        <p className="text-primary-100">
                          {t("contact.addressLine")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-primary-600 rounded-full p-2 mr-4 mt-1">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">
                          {t("contact.phone")}
                        </h3>
                        <p className="text-primary-100">+91 98765 43210</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-primary-600 rounded-full p-2 mr-4 mt-1">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">
                          {t("contact.email")}
                        </h3>
                        <p className="text-primary-100">info@buildmyhome.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-primary-600 rounded-full p-2 mr-4 mt-1">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">
                          {t("contact.businessHours")}
                        </h3>
                        <p className="text-primary-100">
                          {t("contact.businessHoursTime")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium text-lg mb-4">
                      {t("contact.followUs")}
                    </h3>
                    <div className="flex space-x-4">
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="bg-primary-600 hover:bg-primary-500 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                          aria-label="Social media"
                        >
                          {link.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-gray-200 rounded-xl h-64 overflow-hidden">
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                    <span className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto mb-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                        <line x1="8" y1="2" x2="8" y2="18"></line>
                        <line x1="16" y1="6" x2="16" y2="22"></line>
                      </svg>
                      <p>{t("contact.interactiveMap")}</p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="font-heading font-bold text-2xl text-gray-900 mb-8 text-center">
                {t("contact.faq.title")}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FAQ Item 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    {t("contact.faq.q1")}
                  </h3>
                  <p className="text-gray-700">
                    {t("contact.faq.a1")}
                  </p>
                </div>
                
                {/* FAQ Item 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    {t("contact.faq.q2")}
                  </h3>
                  <p className="text-gray-700">
                    {t("contact.faq.a2")}
                  </p>
                </div>
                
                {/* FAQ Item 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    {t("contact.faq.q3")}
                  </h3>
                  <p className="text-gray-700">
                    {t("contact.faq.a3")}
                  </p>
                </div>
                
                {/* FAQ Item 4 */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    {t("contact.faq.q4")}
                  </h3>
                  <p className="text-gray-700">
                    {t("contact.faq.a4")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
