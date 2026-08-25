export const getExperiences = (t) => [
  {
    id: 1,
    category: t('experience.catGIS'),
    title: t('experience.exp1_title'),
    date: t('experience.exp1_date'),
    description: [
      t('experience.exp1_desc1'),
      t('experience.exp1_desc2'),
      t('experience.exp1_desc3'),
      t('experience.exp1_desc4'),
      t('experience.exp1_desc5')
    ],
    tech: ["ArcGIS Pro", "ArcGIS Enterprise 11.x", "Esri REST API", "JavaScript (ES6+)", "React.js", "TypeScript", "Node.js", "Arcade", "Calcite UI"]
  },
  {
    id: 2,
    category: t('experience.catGIS'),
    title: t('experience.exp2_title'),
    date: t('experience.exp2_date'),
    description: [
      t('experience.exp2_desc1'),
      t('experience.exp2_desc2'),
      t('experience.exp2_desc3')
    ],
    tech: ["React.js", "TypeScript", "JavaScript (ES6+)", "Arcade Scripting", "Calcite UI"]
  },
  {
    id: 3,
    category: t('experience.catGIS'),
    title: t('experience.exp3_title'),
    date: t('experience.exp3_date'),
    description: [
      t('experience.exp3_desc1')
    ],
    tech: ["Python", "ArcPy", "Pandas"]
  },
  {
    id: 4,
    category: t('experience.catGIS'),
    title: t('experience.exp4_title'),
    date: t('experience.exp4_date'),
    description: [
      t('experience.exp4_desc1'),
      t('experience.exp4_desc2')
    ],
    tech: ["React-Leaflet", "OpenLayers", "WebGL"]
  },
  {
    id: 5,
    category: t('experience.catUrban'),
    title: t('experience.exp5_title'),
    date: t('experience.exp5_date'),
    description: [
      t('experience.exp5_desc1'),
      t('experience.exp5_desc2'),
      t('experience.exp5_desc3')
    ],
    tech: ["Excel", "Matematiksel Modelleme", "Veri Analitiği", "Sosyal Etki Analizi"]
  }
];

export const getEducation = (t) => [
  {
    id: 1,
    school: t('experience.edu1_school'),
    faculty: t('experience.edu1_faculty'),
    department: t('experience.edu1_dept'),
    date: t('experience.edu1_date'),
    description: t('experience.edu1_desc')
  }
];
