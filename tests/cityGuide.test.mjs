import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('the wave and transition sheets use transparent square robot frames', () => {
  for (const [name, frames] of [['robot-wave', 16], ['robot-portal', 2]]) {
    const asset = readFileSync(new URL(`../public/mascot/${name}.webp`, import.meta.url));
    assert.equal(asset.toString('ascii', 8, 12), 'WEBP');
    assert.ok(asset[20] & 0x10);
    assert.equal(asset.readUIntLE(24, 3) + 1, frames * 256);
    assert.equal(asset.readUIntLE(27, 3) + 1, 256);
    assert.ok(asset.length < 150000);
  }
});
test('the invitation waves without WebGL and respects visibility and reduced motion', () => {
  const source = read('../src/components/city/CityGuide.jsx');
  const css = read('../src/components/city/city.css');
  assert.ok(!source.includes('<canvas'));
  assert.ok(css.includes('/mascot/robot-wave.webp'));
  assert.ok(css.includes('steps(15, end)'));
  assert.ok(source.includes("removeEventListener('visibilitychange'"));
  assert.ok(css.includes(".city-guide[data-paused='true'] .city-guide-frame"));
  assert.match(css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)')), /\.city-guide-frame,[^{]+\{\s*animation: none/);
});

test('the invitation shows one short translated label and stays clickable', () => {
  const source = read('../src/components/city/CityInvitation.jsx');
  assert.ok(source.includes('<CityGuide />'));
  assert.ok(source.includes("t('city.invitation')"));
  assert.ok(!source.includes('city-invitation-bubble'));
  assert.ok(source.includes('onClick={onEnter}'));
  for (const [language, label] of [['tr', '3D keşfet'], ['en', 'Explore in 3D']]) {
    const strings = JSON.parse(read(`../src/i18n/locales/city.${language}.json`));
    assert.equal(strings.invitation, label);
  }
});
