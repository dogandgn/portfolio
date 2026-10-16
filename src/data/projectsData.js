import { BIRDMAP_URL, LUMA_DEMO_URL } from './projectLinks.js';
import { getQgisProject } from './qgisPlugins.js';

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

const getBirdMapDetails = (t) => ({
  title: t('projects.p4_detail_title'),
  environment: t('projects.p4_environment'),
  summary: t('projects.p4_summary'),
  features: [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({
    title: t(`projects.p4_feature${number}_title`),
    description: t(`projects.p4_feature${number}_desc`),
  })),
  sources: [
    {
      id: 'birdbase',
      title: t('projects.p4_birdbase_title'),
      description: t('projects.p4_birdbase_desc'),
      items: [1, 2, 3].map((number) => t(`projects.p4_birdbase_item${number}`)),
      citation: t('projects.p4_birdbase_citation'),
      links: [
        { label: t('projects.p4_birdbase_dataset'), url: 'https://doi.org/10.6084/m9.figshare.27051040' },
        { label: t('projects.p4_birdbase_paper'), url: 'https://doi.org/10.1038/s41597-025-05615-3' },
      ],
    },
    {
      id: 'ebird',
      title: t('projects.p4_ebird_title'),
      description: t('projects.p4_ebird_desc'),
      items: [1, 2, 3].map((number) => t(`projects.p4_ebird_item${number}`)),
      citation: t('projects.p4_ebird_citation'),
      links: [
        { label: t('projects.p4_ebird_dataset'), url: 'https://science.ebird.org/en/use-ebird-data/download-ebird-data-products' },
      ],
    },
  ],
});

const getLumaDetails = (t) => ({
  title: t('projects.p4_luma_title'),
  environment: t('projects.p4_luma_environment'),
  summary: t('projects.p4_luma_summary'),
  features: [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({
    title: t(`projects.p4_luma_feature${number}_title`),
    description: t(`projects.p4_luma_feature${number}_desc`),
  })),
});

export const getProjects = (t) => {
  const layerManagerTech = ["React.js", "TypeScript", "ArcGIS JS API", "Jimu UI/Core", "SheetJS", "jsPDF"];
  const slopeTech = ["React", "ArcGIS JS API", "ElevationLayer", "geometryEngine", "Spatial Reference", "Throttle/Debounce"];
  const authTech = ["React", "ArcGIS Identity Manager", "OAuth2", "OAuthInfo", "Jimu Page Routing"];
  const layerManagerDetails = getLayerManagerDetails(t);
  const birdMapTech = ["React 19", "TypeScript", "React-Leaflet", "Zustand", "TanStack Query", "Turf.js", "Web Workers", "jsPDF", "Vite"];
  const lumaTech = ["React 19", "TypeScript", "MapLibre GL JS", "Three.js", "CesiumJS", "jsPDF", "Vite"];
  const birdMapDetails = getBirdMapDetails(t);

  return [
    {
      id: 'luma',
      title: t('projects.lumaCardTitle'),
      cardDescription: t('projects.lumaCardDescription'),
      description: t('projects.p4_luma_desc'),
      featured: true,
      wideDemo: true,
      tech: lumaTech,
      details: getLumaDetails(t),
      demoProjectId: 4,
      externalUrl: LUMA_DEMO_URL,
      liveTitle: t('projects.p4_luma_liveTitle'),
      iframeTitle: t('projects.p4_luma_iframeTitle'),
      icon: 'fa-building',
      image: '/projects/luma-preview.jpg',
    },
    {
      id: 'birdmap',
      title: t('projects.birdmapCardTitle'),
      cardDescription: t('projects.birdmapCardDescription'),
      description: t('projects.p4_birdmap_desc'),
      featured: true,
      wideDemo: true,
      tech: birdMapTech,
      details: birdMapDetails,
      demoProjectId: 4,
      externalUrl: BIRDMAP_URL,
      liveTitle: t('projects.p4_liveTitle'),
      iframeTitle: t('projects.p4_iframeTitle'),
      icon: 'fa-crow',
      image: '/projects/birdmap-preview.jpg',
    },
    getQgisProject(t),
    {
      id: 1,
      wideDemo: true,
      title: t('projects.p1_title'),
      cardDescription: t('projects.propertyCardDescription'),
      description: t('projects.p1_desc'),
      tech: ["ArcGIS Enterprise", "Esri REST API", "React", "Node.js", "TypeScript", "Arcade"],
      image: "/projects/1.jpg",
    },
    {
      id: 2,
      title: t('projects.p2_title'),
      cardDescription: t('projects.widgetCardDescription'),
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
      cardDescription: t('projects.automationCardDescription'),
      description: t('projects.p3_desc'),
      tech: ["Python", "ArcPy", "Pandas", "Geodatabase"],
      image: "/projects/3.jpg",
    },
  ];
};
