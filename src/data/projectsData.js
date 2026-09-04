const getLayerManagerDetails = (t) => ({
  title: t('projects.p2_detail_title'),
  environment: t('projects.p2_environment'),
  summary: t('projects.p2_summary'),
  features: [
    { title: t('projects.p2_feature1_title'), description: t('projects.p2_feature1_desc') },
    { title: t('projects.p2_feature2_title'), description: t('projects.p2_feature2_desc') },
    {
      title: t('projects.p2_feature3_title'),
      description: t('projects.p2_feature3_desc'),
      items: [t('projects.p2_feature3_item1'), t('projects.p2_feature3_item2'), t('projects.p2_feature3_item3')],
    },
    { title: t('projects.p2_feature4_title'), description: t('projects.p2_feature4_desc') },
    { title: t('projects.p2_feature5_title'), description: t('projects.p2_feature5_desc') },
    { title: t('projects.p2_feature6_title'), description: t('projects.p2_feature6_desc') },
  ],
});

const getSlopeDetails = (t) => ({
  title: t('projects.p2_widget2_title'),
  environment: t('projects.p2_widget2_environment'),
  summary: t('projects.p2_widget2_summary'),
  features: [1, 2, 3, 4].map((number) => ({
    title: t(`projects.p2_widget2_feature${number}_title`),
    description: t(`projects.p2_widget2_feature${number}_desc`),
  })),
});

const getAuthDetails = (t) => ({
  title: t('projects.p2_widget3_title'),
  environment: t('projects.p2_widget3_environment'),
  summary: t('projects.p2_widget3_summary'),
  features: [1, 2, 3, 4].map((number) => ({
    title: t(`projects.p2_widget3_feature${number}_title`),
    description: t(`projects.p2_widget3_feature${number}_desc`),
  })),
});

export const getProjects = (t) => {
  const layerManagerTech = ["React.js", "TypeScript", "ArcGIS JS API", "Jimu UI/Core", "SheetJS", "jsPDF"];
  const slopeTech = ["React", "ArcGIS JS API", "ElevationLayer", "geometryEngine", "Spatial Reference", "Throttle/Debounce"];
  const authTech = ["React", "ArcGIS Identity Manager", "OAuth2", "OAuthInfo", "Jimu Page Routing"];
  const layerManagerDetails = getLayerManagerDetails(t);

  return [
    {
      id: 1,
      title: t('projects.p1_title'),
      description: t('projects.p1_desc'),
      tech: ["ArcGIS Enterprise", "Esri REST API", "React", "Node.js", "TypeScript", "Arcade"],
      image: "/projects/1.jpg",
    },
    {
      id: 2,
      title: t('projects.p2_title'),
      description: t('projects.p2_desc'),
      tech: layerManagerTech,
      details: layerManagerDetails,
      widgets: [
        {
          id: 'layer-manager',
          description: t('projects.p2_desc'),
          tech: layerManagerTech,
          details: layerManagerDetails,
          demoProjectId: 2,
        },
        {
          id: 'coordinate-slope',
          description: t('projects.p2_widget2_desc'),
          tech: slopeTech,
          details: getSlopeDetails(t),
          demoId: 'coordinate-slope',
          image: '/projects/coordinate-slope.png',
          imageAlt: t('projects.p2_widget2_image_alt'),
        },
        {
          id: 'user-profile-logout',
          description: t('projects.p2_widget3_desc'),
          tech: authTech,
          details: getAuthDetails(t),
          demoId: 'user-profile-logout',
        },
      ],
      image: "/projects/2.jpg",
    },
    {
      id: 3,
      title: t('projects.p3_title'),
      description: t('projects.p3_desc'),
      tech: ["Python", "ArcPy", "Pandas", "Geodatabase"],
      image: "/projects/3.jpg",
    },
    {
      id: 4,
      title: t('projects.p4_title'),
      description: t('projects.p4_desc'),
      tech: ["React-Leaflet", "OpenLayers", "WebGL", "PostGIS"],
      image: "/projects/4.jpg",
    },
  ];
};
