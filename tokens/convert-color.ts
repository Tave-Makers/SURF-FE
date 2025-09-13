import fs from 'fs';
import path from 'path';

function loadJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf-8'));
}

// flatten 함수 (중첩 → key.path 변환)
function flatten(obj: any, prefix = '', result: Record<string, string> = {}) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value.$type === 'color') {
      result[newKey] = value.$value;
    } else if (typeof value === 'object') {
      flatten(value, newKey, result);
    }
  }
  return result;
}

// Primitive + Semantic 매핑
function resolveSemantics(
  semantics: any,
  primitiveMap: Record<string, string>,
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const key in semantics) {
    const value = semantics[key];
    if (value.$type === 'color') {
      let resolvedValue = value.$value;
      const match = resolvedValue.match(/\{(.*)\}/);
      if (match) {
        const ref = match[1];
        resolvedValue = primitiveMap[ref] || resolvedValue;
      }
      resolved[key] = resolvedValue;
    }
  }
  return resolved;
}

// 파일 경로
const primitiveLight = loadJSON('tokens/primitive-light.json');
const semanticLight = loadJSON('tokens/semantic-light.json');
const primitiveDark = loadJSON('tokens/primitive-dark.json');
const semanticDark = loadJSON('tokens/semantic-dark.json');

// flatten primitives
const primitiveMapLight = flatten(primitiveLight);
const primitiveMapDark = flatten(primitiveDark);

// resolve semantics
const lightColors = resolveSemantics(semanticLight, primitiveMapLight);
const darkColors = resolveSemantics(semanticDark, primitiveMapDark);

// CSS 출력
let cssOutput = `@import "tailwindcss";\n\n@theme {\n`;

Object.entries(lightColors).forEach(([key, value]) => {
  cssOutput += `  --${key}: ${value};\n`;
});

cssOutput += '}\n\n';

cssOutput += `[data-theme="dark"] {\n`;
Object.entries(darkColors).forEach(([key, value]) => {
  cssOutput += `  --${key}: ${value};\n`;
});
cssOutput += '}\n';

fs.writeFileSync('app/colors.css', cssOutput, 'utf-8');
console.log('✅ Generated app/colors.css');
