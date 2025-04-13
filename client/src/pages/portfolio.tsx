import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Project } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Portfolio = () => {
  const { t, language } = useLanguage();
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  return (
    <>
      <Helmet>
        <title>{t("seo.portfolio.title")} | BuildMyHome</title>
        <meta name="description" content={t("seo.portfolio.description")} />
        <html lang={language} />
      </Helmet>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">
              {t("portfolio.pageTitle")}
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t("portfolio.pageDescription")}
            </p>
          </div>
          
          {/* Project Search/Filter - Future enhancement */}
          
          {/* Portfolio Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-96"></div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="font-heading font-semibold text-xl text-white">
                        {project.title}
                      </h3>
                      <p className="text-gray-200 text-sm">{project.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                          {project.completed ? t("portfolio.completed") : t("portfolio.ongoing")}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {project.location}
                        </span>
                      </div>
                      <Link
                        href={`/portfolio/${project.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                      >
                        {t("portfolio.viewProject")}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                {t("portfolio.noProjectsFound")}
              </p>
            </div>
          )}
          
          {/* Testimonials Section */}
          <div className="mt-20">
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-8 text-center">
              {t("portfolio.testimonials.title")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 p-6 rounded-xl relative">
                <div className="text-primary-600 text-5xl absolute -top-4 -left-2">"</div>
                <p className="text-gray-700 mb-4 mt-2 relative z-10">
                  {t("portfolio.testimonials.testimonial1.text")}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                    <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("portfolio.testimonials.testimonial1.name")}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t("portfolio.testimonials.testimonial1.location")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-gray-50 p-6 rounded-xl relative">
                <div className="text-primary-600 text-5xl absolute -top-4 -left-2">"</div>
                <p className="text-gray-700 mb-4 mt-2 relative z-10">
                  {t("portfolio.testimonials.testimonial2.text")}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                    <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("portfolio.testimonials.testimonial2.name")}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t("portfolio.testimonials.testimonial2.location")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-gray-50 p-6 rounded-xl relative">
                <div className="text-primary-600 text-5xl absolute -top-4 -left-2">"</div>
                <p className="text-gray-700 mb-4 mt-2 relative z-10">
                  {t("portfolio.testimonials.testimonial3.text")}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                    <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("portfolio.testimonials.testimonial3.name")}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t("portfolio.testimonials.testimonial3.location")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-16 bg-primary-50 p-8 rounded-xl text-center">
            <h2 className="font-heading font-semibold text-2xl text-primary-900 mb-4">
              {t("portfolio.cta.title")}
            </h2>
            <p className="text-primary-800 mb-6 max-w-2xl mx-auto">
              {t("portfolio.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/custom-builder">
                  {t("portfolio.cta.startBuilding")}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  {t("portfolio.cta.contactUs")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
