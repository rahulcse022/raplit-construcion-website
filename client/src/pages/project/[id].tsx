
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { Project } from "@shared/schema";
import { Helmet } from "react-helmet";

const ProjectDetails = () => {
  const [, params] = useRoute("/project/:id");
  const { t, language } = useLanguage();
  
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t("project.notFound")}
        </h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | BuildMyHome</title>
        <meta name="description" content={project.description} />
        <html lang={language} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-bold text-4xl text-gray-900 mb-6">
            {project.title}
          </h1>
          
          <div className="aspect-video rounded-xl overflow-hidden mb-8">
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700">{project.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{t("project.location")}</div>
              <div className="font-medium text-gray-900">{project.location}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{t("project.size")}</div>
              <div className="font-medium text-gray-900">{project.size} sq.ft</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{t("project.duration")}</div>
              <div className="font-medium text-gray-900">{project.duration}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{t("project.status")}</div>
              <div className="font-medium text-gray-900">
                {project.completed ? t("project.completed") : t("project.ongoing")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
