import { useLanguage } from "@/context/LanguageContext";

const ServicesSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: "building",
      title: t("services.construction.title"),
      description: t("services.construction.description"),
    },
    {
      icon: "couch",
      title: t("services.interiorDesign.title"),
      description: t("services.interiorDesign.description"),
    },
    {
      icon: "chair",
      title: t("services.furnishing.title"),
      description: t("services.furnishing.description"),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-gray-900 mb-4">
            {t("services.title")}
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group"
            >
              <div className="bg-primary-600 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {service.icon === "building" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  )}
                  {service.icon === "couch" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8v10a1 1 0 001 1h16a1 1 0 001-1V8a4 4 0 00-4-4H7a4 4 0 00-4 4zm0 7v-3a2 2 0 012-2h14a2 2 0 012 2v3"
                    />
                  )}
                  {service.icon === "chair" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  )}
                </svg>
              </div>
              <h3 className="font-heading font-bold text-2xl mb-4 text-gray-900 group-hover:text-primary-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <a href="#" className="inline-flex items-center text-primary-600 font-medium group-hover:text-yellow-500 transition-colors">
                  Learn more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
