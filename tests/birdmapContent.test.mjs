import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createInstance } from 'i18next';
import { getProjects } from '../src/data/projectsData.js';
import { BIRDMAP_URL } from '../src/data/projectLinks.js';

for (const language of ['tr', 'en']) {
  test(`BirdMap report content resolves completely in ${language}`, async () => {
    const translation = JSON.parse(
      readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), 'utf8'),
    );
    const i18n = createInstance();
    await i18n.init({ lng: language, resources: { [language]: { translation } } });
    const project = getProjects(i18n.t).find(({ id }) => id === 'birdmap');
    const requestedKeys = [];
    getProjects((key) => {
      if (/^projects\.(p4_(?!luma|desc|title)|birdmap)/.test(key)) requestedKeys.push(key);
      return i18n.t(key);
    });
    for (const key of requestedKeys) {
      assert.ok(i18n.exists(key), `Missing ${key}`);
      assert.ok(i18n.t(key).trim());
    }
    assert.equal(project.externalUrl, BIRDMAP_URL);
    assert.equal(project.demoProjectId, 4);
    assert.equal(project.details.features.length, 8);
    assert.match(project.details.environment, /Fastify.*PostgreSQL 17.*PostGIS/);
    for (const count of ['543', '505', '31', '7', '541', '536']) {
      assert.ok(project.details.summary.includes(count));
    }
    assert.match(project.details.features[1].description, /142/);
    assert.match(project.details.features[2].description, /localStorage/);
    assert.match(project.details.features[3].description, /Worker/);
    assert.match(project.details.features[5].description, /15/);
    assert.doesNotMatch(JSON.stringify(project.details), /UN OCHA|COD-AB/);
    assert.ok(project.tech.includes('TanStack Query'));
    assert.deepEqual(project.details.sources.map(({ id }) => id), ['birdbase', 'ebird']);
    for (const source of project.details.sources) {
      assert.equal(source.items.length, 3);
      for (const value of [source.title, source.description, source.citation, ...source.items]) {
        assert.ok(value.trim());
        assert.doesNotMatch(value, /^projects\./);
      }
      for (const link of source.links) {
        assert.equal(new URL(link.url).protocol, 'https:');
        assert.ok(link.label.trim());
        assert.doesNotMatch(link.label, /^projects\./);
      }
    }
    assert.match(project.details.sources[0].description, /v2025\.1/);
    assert.match(project.details.sources[1].description, /EBD_relJul-2026/);
    assert.deepEqual(project.details.sources[0].links.map(({ url }) => url), [
      'https://doi.org/10.6084/m9.figshare.27051040',
      'https://doi.org/10.1038/s41597-025-05615-3',
    ]);
    assert.ok(i18n.exists('projects.sourcesLabel'));
  });
}

test('classic and city views use shared project content and detail modal', () => {
  for (const file of ['section/Projects.jsx', 'city/CityExperience.jsx']) {
    const source = readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8');
    assert.match(source, /getProjects\(t\)/);
    assert.match(source, /<ProjectModal/);
  }
  const source = readFileSync(new URL('../src/components/city/CityStopContent.jsx', import.meta.url), 'utf8');
  assert.match(source, /project\.cardDescription/);
});

test('source references are optional and rendered as safe external links', () => {
  const source = readFileSync(new URL('../src/components/ui/ProjectModal.jsx', import.meta.url), 'utf8');
  assert.match(source, /activeDetails\.sources\?\.length > 0/);
  assert.match(source, /href=\{link\.url\}/);
  assert.match(source, /rel="noopener noreferrer"/);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
  const projects = getProjects((key) => key);
  assert.ok(projects.filter(({ id }) => id !== 'birdmap').every((project) => !project.details?.sources));
});
