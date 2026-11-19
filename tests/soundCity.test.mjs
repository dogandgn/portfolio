import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { createInstance } from 'i18next';
import { getProjects } from '../src/data/projectsData.js';
import { SOUND_CITY_URL } from '../src/data/projectLinks.js';
import { cityStops, landmarks } from '../src/components/city/cityLayout.js';

for (const language of ['tr', 'en']) {
  test(`Sound City shares a complete featured project and city identity in ${language}`, async () => {
    const translation = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), 'utf8'));
    const i18n = createInstance();
    await i18n.init({ lng: language, resources: { [language]: { translation } } });
    const projects = getProjects(i18n.t);
    assert.deepEqual(projects.filter(({ featured }) => featured).map(({ id }) => id), ['luma', 'birdmap', 'kent-gozlemi', 'soundcity']);
    const project = projects.find(({ id }) => id === 'soundcity');
    assert.equal(project.title, 'Sound City');
    assert.equal(project.externalUrl, SOUND_CITY_URL);
    const deployment = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
    const csp = deployment.headers[0].headers.find(({ key }) => key === 'Content-Security-Policy').value;
    const frameOrigins = csp.split('; ').find(rule => rule.startsWith('frame-src ')).split(' ').slice(1);
    for (const demo of projects.filter(({ demoProjectId }) => demoProjectId === 4)) {
      assert.ok(frameOrigins.includes(new URL(demo.externalUrl).origin));
    }
    for (const id of ['kent-gozlemi', 'soundcity']) {
      const preview = projects.find(demo => demo.id === id);
      assert.equal(preview.demoProjectId, 'project-preview');
      assert.ok(existsSync(new URL(`../public${preview.screenshot}`, import.meta.url)));
      assert.equal(new URL(preview.externalUrl).protocol, 'https:');
    }
    assert.equal(project.tags.length, 3);
    assert.ok(existsSync(new URL(`../public${project.image}`, import.meta.url)));
    for (const value of [project.description, project.actionLabel, ...project.tags, project.details.summary, ...project.details.features.flatMap(({ title, description }) => [title, description])]) {
      assert.ok(value.trim());
      assert.doesNotMatch(value, /^projects\./);
    }
    if (language === 'tr') assert.equal(project.actionLabel, 'Deneyimi aç');
    const stop = cityStops.find(({ id }) => id === 'soundcity');
    assert.equal(stop.projectId, project.id);
    assert.equal(landmarks.find(({ id }) => id === stop.id).projectId, project.id);
    assert.equal(cityStops.findIndex(({ id }) => id === 'soundcity'), cityStops.findIndex(({ id }) => id === 'kent-gozlemi') + 1);
  });
}
