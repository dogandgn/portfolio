export const qgisPlugins = [
  {
    id: 'vector-converter',
    version: '0.9.0',
    repositoryUrl: 'https://github.com/dogandgn/vector-converter',
    tech: ['Python', 'PyQGIS', 'Qt', 'GDAL/OGR', 'PROJ', 'SQLite'],
    screenshots: ['workflow', 'attributes', 'coordinates', 'results'].map(
      (id) => ({
        id,
        src: `/projects/qgis/vector-converter-${id}.png`,
      }),
    ),
  },
];

export function getQgisProject(t) {
  const plugins = qgisPlugins.map((plugin) => ({
    ...plugin,
    description: t(`qgis.plugins.${plugin.id}.description`),
    details: t(`qgis.plugins.${plugin.id}.details`, { returnObjects: true }),
    demoId: 'qgis-plugin',
  }));
  return {
    id: 'qgis',
    title: t('qgis.title'),
    cardDescription: t('qgis.description'),
    description: t('qgis.description'),
    tech: ['Python', 'PyQGIS', 'Qt', 'GDAL/OGR'],
    image: '/projects/qgis/preview.svg',
    cardLabel: t('qgis.cardLabel'),
    plugins,
  };
}

export function getPluginFloors(plugins = qgisPlugins) {
  return plugins.map((plugin, index) => ({
    id: plugin.id,
    number: index + 1,
    y: 1.1 + (index + 0.5) * 2.4,
    height: 2.28,
  }));
}
