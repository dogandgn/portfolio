import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

test('the portfolio consistently uses the dotted i in Ariç', () => {
  const source = new URL('../src/', import.meta.url);
  const files = readdirSync(source, { recursive: true }).filter((file) =>
    /\.(jsx?|json|css)$/.test(file),
  );
  for (const file of files) {
    const text = readFileSync(new URL(file.replaceAll('\\', '/'), source), 'utf8');
    assert.doesNotMatch(text, /(?<!\p{L})(?:Arıç|ARIÇ|arıç)(?!\p{L})/u, file);
  }
  for (const file of [
    'index.html',
    'src/components/city/CityExperience.jsx',
    'src/components/city/CityStopContent.jsx',
  ]) {
    assert.match(
      readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'),
      /Doğan Ariç/,
    );
  }
});
