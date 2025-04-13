import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSavedPlans } from "@/context/SavedPlansContext";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Eye, Pencil, Home } from "lucide-react";

const SavedPlans = () => {
  const { t, language } = useLanguage();
  const { savedPlans, removePlan } = useSavedPlans();
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);
  
  // Get all packages to display saved package details
  const { data: packages } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    enabled: savedPlans.some(plan => plan.packageId !== undefined),
  });

  // Get package details by ID
  const getPackageDetails = (packageId: number | undefined) => {
    if (!packageId || !packages) return null;
    return packages.find(pkg => pkg.id === packageId);
  };

  // Format custom home details for display
  const formatCustomDetails = (customPackage: any) => {
    if (!customPackage) return null;
    
    return {
      size: customPackage.landArea ? `${customPackage.landArea} sq.ft` : "N/A",
      bedrooms: customPackage.bedrooms || "N/A",
      bathrooms: customPackage.bathrooms || "N/A",
      floors: customPackage.floors || "N/A",
      type: customPackage.houseType 
        ? t(`customBuilder.houseTypes.${customPackage.houseType}`) 
        : "N/A",
      estimatedCost: customPackage.estimatedCost 
        ? `₹${customPackage.estimatedCost.toLocaleString()}` 
        : "N/A",
    };
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (planToDelete !== null) {
      removePlan(planToDelete);
      setPlanToDelete(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("seo.savedPlans.title")} | BuildMyHome</title>
        <meta name="description" content={t("seo.savedPlans.description")} />
        <html lang={language} />
      </Helmet>

      <div className="bg-gray-50 py-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">
              {t("savedPlans.pageTitle")}
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t("savedPlans.pageDescription")}
            </p>
          </div>
          
          {savedPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlans.map((plan, index) => {
                const packageDetails = plan.packageId ? getPackageDetails(plan.packageId) : null;
                const customDetails = formatCustomDetails(plan.customPackage);
                
                return (
                  <Card key={index} className="overflow-hidden">
                    {packageDetails ? (
                      // Package-based plan
                      <>
                        <div className="relative h-48">
                          <img
                            src={packageDetails.imageUrl}
                            alt={packageDetails.name}
                            className="w-full h-full object-cover"
                          />
                          {packageDetails.popular && (
                            <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              {t("packages.popular")}
                            </div>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle>{packageDetails.name}</CardTitle>
                          <CardDescription>{packageDetails.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">{t("packages.size")}:</span>
                              <span>{packageDetails.size} sq.ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">{t("packages.bedrooms")}:</span>
                              <span>{packageDetails.bedrooms} BHK</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">{t("packages.price")}:</span>
                              <span>₹{(packageDetails.price / 100000).toFixed(2)} {t("packages.lakhs")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">{t("packages.style")}:</span>
                              <span>{packageDetails.style}</span>
                            </div>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      // Custom home plan
                      <>
                        <CardHeader className="bg-primary-50">
                          <CardTitle>{t("savedPlans.customHome")}</CardTitle>
                          <CardDescription>{t("savedPlans.customHomeDescription")}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          {customDetails ? (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">{t("packages.size")}:</span>
                                <span>{customDetails.size}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">{t("packages.bedrooms")}:</span>
                                <span>{customDetails.bedrooms}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">{t("packages.floors")}:</span>
                                <span>{customDetails.floors}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">{t("packages.type")}:</span>
                                <span>{customDetails.type}</span>
                              </div>
                              <div className="col-span-2 flex justify-between">
                                <span className="font-medium">{t("customBuilder.estimatedCost")}:</span>
                                <span className="font-semibold text-primary-700">{customDetails.estimatedCost}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              {t("savedPlans.detailsUnavailable")}
                            </p>
                          )}
                        </CardContent>
                      </>
                    )}
                    <CardFooter className="flex gap-2">
                      {plan.packageId ? (
                        // Actions for package-based plan
                        <>
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <Link href={`/packages/${plan.packageId}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("savedPlans.view")}
                            </Link>
                          </Button>
                          <Button size="sm" asChild className="flex-1">
                            <Link href={`/custom-builder?packageId=${plan.packageId}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              {t("savedPlans.customize")}
                            </Link>
                          </Button>
                        </>
                      ) : (
                        // Actions for custom home plan
                        <Button size="sm" asChild className="flex-1">
                          <Link href="/custom-builder">
                            <Eye className="mr-2 h-4 w-4" />
                            {t("savedPlans.continueCustomizing")}
                          </Link>
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => setPlanToDelete(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("savedPlans.deleteConfirm.title")}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("savedPlans.deleteConfirm.description")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("savedPlans.deleteConfirm.cancel")}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteConfirm}
                              className="bg-destructive text-destructive-foreground"
                            >
                              {t("savedPlans.deleteConfirm.confirm")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto">
              <div className="mb-4">
                <Home className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t("savedPlans.noPlans.title")}</h2>
              <p className="text-gray-600 mb-6">{t("savedPlans.noPlans.description")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/custom-builder">
                    {t("savedPlans.noPlans.createCustom")}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/packages">
                    {t("savedPlans.noPlans.browsePackages")}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedPlans;
