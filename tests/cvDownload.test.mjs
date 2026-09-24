import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createInstance } from 'i18next';

const resources = Object.fromEntries(
  ['tr', 'en'].map((language) => [
    language,
    {
      translation: JSON.parse(
        readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), 'utf8'),
      ),
    },
  ]),
);

test('CV downloads follow language changes and the Turkish fallback', async () => {
  const i18n = createInstance();
  await i18n.init({ resources, lng: 'tr', fallbackLng: 'tr' });
  for (const [language, expected] of [
    ['tr', '/dogan_aric_tr.pdf'],
    ['en', '/dogan_aric_eng.pdf'],
    ['en-US', '/dogan_aric_eng.pdf'],
    ['tr-TR', '/dogan_aric_tr.pdf'],
    ['de', '/dogan_aric_tr.pdf'],
  ]) {
    await i18n.changeLanguage(language);
    assert.equal(i18n.t('hero.cvFile'), expected);
    const file = readFileSync(new URL(`../public${expected}`, import.meta.url));
    assert.equal(file.subarray(0, 5).toString(), '%PDF-');
  }
});

test('classic and city views use the translated PDF download link', () => {
  for (const file of ['section/Hero.jsx', 'city/CityStopContent.jsx']) {
    const source = readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8');
    assert.match(source, /href=\{t\('hero\.cvFile'\)\}\s+download/);
    assert.doesNotMatch(source, /href="\/cv\.jpg"/);
  }
});
