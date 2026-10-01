import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('the guide atlas has four square frames and retains transparency', () => {
  const asset = readFileSync(new URL('../public/mascot/guide-wave-v2.webp', import.meta.url));
  assert.equal(asset.toString('ascii', 0, 4), 'RIFF');
  assert.equal(asset.toString('ascii', 8, 12), 'WEBP');
  assert.equal(asset.toString('ascii', 12, 16), 'VP8X');
  assert.ok(asset[20] & 0x10);
  const width = asset.readUIntLE(24, 3) + 1;
  const height = asset.readUIntLE(27, 3) + 1;
  assert.equal(width, 1254);
  assert.equal(height, width);
  assert.equal(width % 2, 0);
  assert.ok(asset.length < 250000);
});

test('the guide uses the local atlas without loading a separate WebGL renderer', () => {
  const source = read('../src/components/city/CityGuide.jsx');
  assert.ok(source.includes('/mascot/guide-wave-v2.webp'));
  assert.ok(source.includes('onLoad='));
  assert.ok(source.includes('onError='));
  assert.ok(source.includes('city-guide-fallback'));
  assert.ok(!source.includes('<canvas'));
  assert.ok(!source.includes('createGuideRenderer'));
});

test('waving has idle gaps, pauses when hidden and respects reduced motion', () => {
  const source = read('../src/components/city/CityGuide.jsx');
  const css = read('../src/components/city/city.css');
  assert.ok(source.includes("removeEventListener('visibilitychange'"));
  assert.ok(source.includes('String(document.hidden)'));
  assert.ok(css.includes('city-guide-wave 12s steps(1, end) infinite'));
  assert.ok(css.includes(".city-guide[data-paused='true'] .city-guide-image"));
  assert.ok(css.includes('animation-play-state: paused'));
  const reducedMotion = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.ok(reducedMotion.includes('.city-guide-image'));
  assert.ok(reducedMotion.includes('.city-mascot:is(:hover, :focus-visible) .city-guide-image'));
  assert.ok(reducedMotion.includes('animation: none'));
  assert.ok(reducedMotion.includes('transform: none'));
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
