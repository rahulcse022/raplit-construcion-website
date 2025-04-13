import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useBuilder } from "@/context/BuilderContext";
import { useSavedPlans } from "@/context/SavedPlansContext";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Home, Download, Save, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InteriorType } from "@shared/schema";

interface Step5SummaryProps {
  onBack: () => void;
}

// Form validation schema
const inquiryFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phoneNumber: z.string().min(10, { message: "Phone number is required" }),
  email: z.string().email({ message: "Valid email is required" }).optional().or(z.literal("")),
  location: z.string().min(2, { message: "Location is required" }),
  requirements: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

const Step5Summary = ({ onBack }: Step5SummaryProps) => {
  const { t } = useLanguage();
  const { homeDetails, estimatedCost } = useBuilder();
  const { savePlan } = useSavedPlans();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSaved, setIsSaved] = useState(false);

  // Form setup
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      location: "",
      requirements: "",
    },
  });

  // Submit inquiry mutation
  const { mutate: submitInquiry, isPending } = useMutation({
    mutationFn: async (data: InquiryFormValues) => {
      return apiRequest("POST", "/api/inquiries", {
        ...data,
        customPackage: homeDetails,
      });
    },
    onSuccess: () => {
      toast({
        title: t("customBuilder.summary.inquirySuccess"),
        description: t("customBuilder.summary.inquirySuccessDescription"),
      });
      
      // Navigate to homepage after successful submission
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: t("customBuilder.summary.inquiryError"),
        description: error.message || t("customBuilder.summary.inquiryErrorDescription"),
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: InquiryFormValues) => {
    submitInquiry(data);
  };

  // Handle saving the current plan
  const handleSavePlan = () => {
    savePlan({
      customPackage: homeDetails
    });
    setIsSaved(true);
    toast({
      title: t("customBuilder.summary.planSaved"),
      description: t("customBuilder.summary.planSavedDescription"),
    });
  };

  // Get material names for display
  const getMaterialName = (category: string, materialId?: number) => {
    if (!materialId) return t("customBuilder.summary.notSelected");
    
    // This would typically fetch from API data or context
    // Mock material names for display purposes
    const materials: Record<number, string> = {
      1: "Italian Marble",
      2: "Engineered Wood",
      3: "Granite Countertop",
      4: "Designer Tiles",
      5: "Textured Paint",
      6: "Hardwood Doors",
    };
    
    return materials[materialId] || t("customBuilder.summary.customMaterial");
  };

  // Translation mapping for interior type
  const getInteriorTypeLabel = (type: InteriorType) => {
    const types = {
      basic: t("customBuilder.interiors.types.basic.label"),
      premium: t("customBuilder.interiors.types.premium.label"),
      luxury: t("customBuilder.interiors.types.luxury.label"),
    };
    return types[type] || types.basic;
  };

  return (
    <div className="space-y-8">
      <h3 className="font-heading font-semibold text-xl text-gray-900">
        {t("customBuilder.summary.title")}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Home Details Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("customBuilder.summary.homeDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.landArea")}</dt>
                  <dd>{homeDetails.landArea} sq.ft</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.floors")}</dt>
                  <dd>{homeDetails.floors}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.bedrooms")}</dt>
                  <dd>{homeDetails.bedrooms}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.bathrooms")}</dt>
                  <dd>{homeDetails.bathrooms}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.houseType")}</dt>
                  <dd>{t(`customBuilder.houseTypes.${homeDetails.houseType}`)}</dd>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.design.floorPlan")}</dt>
                  <dd>{t(`customBuilder.design.floorPlans.${homeDetails.design?.floorPlan || 'open'}.title`)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.design.ceilingHeight")}</dt>
                  <dd>{t(`customBuilder.design.ceilingHeights.${homeDetails.design?.ceilingHeight || 'standard'}`)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.design.windowStyle")}</dt>
                  <dd>{t(`customBuilder.design.windowStyles.${homeDetails.design?.windowStyle || 'standard'}.title`)}</dd>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="font-medium">{t("customBuilder.materials.title")}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t("materials.categories.flooring")}</span>
                      <span>{getMaterialName("flooring", homeDetails.materials?.flooring)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("materials.categories.walls")}</span>
                      <span>{getMaterialName("walls", homeDetails.materials?.walls)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("materials.categories.kitchen")}</span>
                      <span>{getMaterialName("kitchen", homeDetails.materials?.kitchen)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("materials.categories.bathroom")}</span>
                      <span>{getMaterialName("bathroom", homeDetails.materials?.bathroom)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("materials.categories.doors")}</span>
                      <span>{getMaterialName("doors", homeDetails.materials?.doors)}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.interiors.interiorType")}</dt>
                  <dd>{getInteriorTypeLabel(homeDetails.interiorType || "basic")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">{t("customBuilder.interiors.lightingQuality")}</dt>
                  <dd>
                    {homeDetails.interiors?.lightingQuality === 1 && t("customBuilder.interiors.lightingLevels.basic")}
                    {homeDetails.interiors?.lightingQuality === 2 && t("customBuilder.interiors.lightingLevels.standard")}
                    {homeDetails.interiors?.lightingQuality === 3 && t("customBuilder.interiors.lightingLevels.premium")}
                  </dd>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">{t("customBuilder.interiors.appliances.title")}</div>
                  <div className="flex flex-wrap gap-1">
                    {homeDetails.interiors?.appliances?.map((appliance) => (
                      <span key={appliance} className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                        {t(`customBuilder.interiors.appliances.${appliance}`)}
                      </span>
                    ))}
                    {(!homeDetails.interiors?.appliances || homeDetails.interiors.appliances.length === 0) && (
                      <span className="text-gray-500 text-sm">{t("customBuilder.summary.noAppliancesSelected")}</span>
                    )}
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {/* Cost Estimate Card */}
          <Card className="bg-primary-50">
            <CardHeader>
              <CardTitle>{t("customBuilder.summary.estimatedCost")}</CardTitle>
              <CardDescription>
                {t("customBuilder.summary.estimateDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary-800">
                ₹{estimatedCost.toLocaleString()}
              </div>
              <p className="text-sm text-primary-700 mt-2">
                {t("customBuilder.summary.estimateNote")}
              </p>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleSavePlan}
                  disabled={isSaved}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaved 
                    ? t("customBuilder.summary.planSaved") 
                    : t("customBuilder.summary.savePlan")
                  }
                </Button>
                
                <Button variant="secondary" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  {t("customBuilder.summary.downloadEstimate")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Inquiry Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("customBuilder.summary.submitInquiry")}</CardTitle>
            <CardDescription>
              {t("customBuilder.summary.submitInquiryDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <FormLabel>{t("customBuilder.summary.additionalRequirements")}</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isPending 
                      ? t("customBuilder.summary.submitting") 
                      : t("customBuilder.summary.submitInquiry")
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("customBuilder.back")}
        </Button>
        
        <Button variant="ghost" onClick={() => navigate("/")}>
          <Home className="mr-2 h-4 w-4" />
          {t("customBuilder.backToHome")}
        </Button>
      </div>
    </div>
  );
};

export default Step5Summary;
