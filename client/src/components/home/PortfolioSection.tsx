import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { ArrowRight } from "lucide-react";

const PortfolioSection = () => {
  const { t } = useLanguage();
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  // Only show 3 projects on the homepage
  const displayProjects = projects?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-gray-900 mb-4">
            {t("portfolio.title")}
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-96"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
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
        )}

        {/* View More Button */}
        <div className="text-center mt-10">
          <Link
            href="/portfolio"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            {t("portfolio.viewAllProjects")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
