import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/context/LanguageContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
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
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

// Define schema for the contact form
const contactFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional()
    .or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  requirements: z.string().optional().or(z.literal("")),
  marketingConsent: z.boolean().default(false).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { t } = useLanguage();
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
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
                {t("contact.getInTouch")}
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending
                      ? t("contact.form.submitting")
                      : t("contact.form.submitInquiry")}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-blue-700 text-white rounded-xl p-6 md:p-8 mb-8">
                <h2 className="font-heading font-semibold text-2xl mb-6">
                  {t("contact.contactInformation")}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
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
                    <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
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
                    <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
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
                    <div className="bg-blue-600 rounded-full p-2 mr-4 mt-1">
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
                        className="bg-blue-600 hover:bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Social media"
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md h-[320px]">
                <iframe
                  src={`https://maps.google.com/maps?q=26.988300,75.860001&z=15&output=embed`}
                  className="w-full h-full border-0"
                  title={t("contact.officeAddress")}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
