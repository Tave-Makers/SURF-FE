import fs from 'fs';
import path from 'path';

/* 입력 JSON 파일 경로 */
const INPUT = 'tokens/tokens.json';

/* 출력 폴더 */
const OUTPUT_DIR = 'tokens';

/* 출력 파일 함수 */
function writeJSON(filename: string, data: unknown) {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ ${filename} 생성됨`);
}

/* 출력 폴더 초기화 */
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

/* JSON 읽기 */
const raw = fs.readFileSync(INPUT, 'utf-8');
const json = JSON.parse(raw);

/* -----------------------------
    COLORS
----------------------------- */
const colors = {
  primitive: {
    light: json['Primitive/Light'] || {},
    dark: json['Primitive/Dark'] || {},
  },
  semantic: {
    light: json['Semantic/Light'] || {},
    dark: json['Semantic/Dark'] || {},
  },
};

/* -----------------------------
    TYPOGRAPHY
----------------------------- */
const typography = {
  system: {
    family: json['Typography/Mode 1']?.family || {},
    weight: json['Typography/Mode 1']?.weight || {},
    size: json['Typography/Mode 1']?.size || {},
    height: json['Typography/Mode 1']?.height || {},
    spacing: json['Typography/Mode 1']?.spacing || {},
  },
  tokens: {
    Title: json['']?.Title || {},
    Body: json['']?.Body || {},
    Caption: json['']?.Caption || {},
    fontSize: json['']?.fontSize || {},
    letterSpacing: json['']?.letterSpacing || {},
    paragraphSpacing: json['']?.paragraphSpacing || {},
    paragraphIndent: json['']?.paragraphIndent || {},
  },
};

/* -----------------------------
    SPACING
----------------------------- */
const spacing = {
  unit: json['Scheme/Default']?.unit || {},
  spacing: json['Scheme/Default']?.spacing || {},
  radius: json['Scheme/Default']?.radius || {},
  margin: json['Scheme/Default']?.margin || {},
};

/* -----------------------------
    SHADOW
----------------------------- */
const shadow = {
  primitive: {
    embossed: json['']?.embossed,
    'embossed-inverse': json['']?.['embossed-inverse'],
    lifted: json['']?.lifted,
    raised: json['']?.raised,
    'raised-inverse': json['']?.['raised-inverse'],
    floated: json['']?.floated,
  },
  semantic: {
    light: json['Semantic/Light']?.effect?.shadow || {},
    dark: json['Semantic/Dark']?.effect?.shadow || {},
  },
};

/* -----------------------------
    OPACITY
----------------------------- */
const opacity = {
  opacity: json['Scheme/Default']?.opacity || {},
};

/* -----------------------------
    MISC(stroke, overlay, blur 등)
----------------------------- */
const misc = {
  stroke: json['Scheme/Default']?.stroke || {},
  overlay: {
    light: json['Semantic/Light']?.effect?.overlay || {},
    dark: json['Semantic/Dark']?.effect?.overlay || {},
  },
  backgroundBlur: {
    light: json['Semantic/Light']?.effect?.backgroundblur || {},
    dark: json['Semantic/Dark']?.effect?.backgroundblur || {},
  },
};

/* 출력 */
writeJSON('colors1.json', colors);
writeJSON('typography1.json', typography);
writeJSON('spacing1.json', spacing);
writeJSON('shadow1.json', shadow);
writeJSON('opacity1.json', opacity);
writeJSON('misc1.json', misc);
