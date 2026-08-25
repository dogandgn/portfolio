export const getProjects = (t) => [
  {
    id: 1,
    title: t('projects.p1_title'),
    description: t('projects.p1_desc'),
    tech: ["ArcGIS Enterprise", "Esri REST API", "React", "Node.js", "TypeScript", "Arcade"],
    image: "/projects/1.jpg"
  },
  {
    id: 2,
    title: t('projects.p2_title'),
    description: t('projects.p2_desc'),
    tech: ["React.js", "TypeScript", "JavaScript (ES6+)", "Arcade Scripting", "Calcite UI"],
    image: "/projects/2.jpg"
  },
  {
    id: 3,
    title: t('projects.p3_title'),
    description: t('projects.p3_desc'),
    tech: ["Python", "ArcPy", "Pandas", "Geodatabase"],
    image: "/projects/3.jpg"
  },
  {
    id: 4,
    title: t('projects.p4_title'),
    description: t('projects.p4_desc'),
    tech: ["React-Leaflet", "OpenLayers", "WebGL", "PostGIS"],
    image: "/projects/4.jpg"
  }
];