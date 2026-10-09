import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createInstance } from 'i18next';
import { getEducation } from '../src/data/resumeData.js';

for (const [language, status] of [
  ['tr', 'Tez aşamasında'],
  ['en', 'Thesis in progress'],
]) {
  test(`education lists the ongoing master's first in ${language}`, async () => {
    const translation = JSON.parse(
      readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), 'utf8'),
    );
    const i18n = createInstance();
    await i18n.init({ lng: language, resources: { [language]: { translation } } });
    const education = getEducation(i18n.t.bind(i18n));

    assert.deepEqual(education.map(({ id }) => id), [2, 1]);
    assert.equal(education[0].date, status);
    assert.doesNotMatch(education[0].date, /\d/);
    assert.equal(education[1].date, '2015 - 2020');
    for (const entry of education) {
      for (const field of ['school', 'faculty', 'department', 'date', 'description']) {
        assert.ok(entry[field].trim());
        assert.doesNotMatch(entry[field], /^experience\./);
      }
    }
  });
}

test('classic and city education sections share the same education data', () => {
  for (const file of ['section/Experience.jsx', 'city/CityStopContent.jsx']) {
    const source = readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8');
    assert.match(source, /getEducation\(t\)/);
  }
});
