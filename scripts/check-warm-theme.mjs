import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const srcDir = join(root, 'src');

const allowedWordExceptions = [
  'blue/purple',
  'yellow/violet',
  'Blue-blind',
];

const bannedPatterns = [
  { name: 'Cool Tailwind text classes', regex: /\btext-(?:indigo|blue|purple|violet|slate)-\d{2,3}\b/g },
  { name: 'Cool Tailwind bg classes', regex: /\bbg-(?:indigo|blue|purple|violet|slate)-\d{2,3}(?:\/\d{1,3})?\b/g },
  { name: 'Cool Tailwind border classes', regex: /\bborder-(?:indigo|blue|purple|violet|slate)-\d{2,3}(?:\/\d{1,3})?\b/g },
  { name: 'Cool Tailwind ring/accent classes', regex: /\b(?:ring|accent|from|to|via)-(?:indigo|blue|purple|violet|slate)-\d{2,3}(?:\/\d{1,3})?\b/g },
  { name: 'Cool theme hex colors', regex: /#(?:34d399|60a5fa|3b82f6|a78bfa|6366f1|7c3aed|8b5cf6|818cf8)\b/gi },
  { name: 'Cool rgba values', regex: /rgba\((?:99,\s*102,\s*241|124,\s*58,\s*237|139,\s*92,\s*246|59,\s*130,\s*246)\s*,[^)]*\)/gi },
  { name: 'Undefined slate token refs', regex: /--color-slate-(?:700|800)\b/g },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === '__tests__' || entry === 'utils') continue;
      out.push(...walk(full));
    } else {
      const ext = extname(full);
      if (ext === '.jsx' || ext === '.css') out.push(full);
    }
  }
  return out;
}

function isAllowedWordContext(line) {
  return allowedWordExceptions.some((word) => line.includes(word));
}

const files = walk(srcDir);
const violations = [];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    for (const rule of bannedPatterns) {
      const matches = [...line.matchAll(rule.regex)];
      if (matches.length === 0) continue;

      for (const m of matches) {
        const token = m[0];
        const isWordOnly = /blue|purple|violet/i.test(token) && !token.includes('-') && !token.startsWith('#');
        if (isWordOnly && isAllowedWordContext(line)) continue;

        violations.push({
          file: relative(root, file).replaceAll('\\\\', '/'),
          line: lineNo,
          rule: rule.name,
          token,
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error('Warm theme compliance check failed. Found cool-tone tokens:');
  for (const v of violations) {
    console.error(`- ${v.file}:${v.line} [${v.rule}] ${v.token}`);
  }
  process.exit(1);
}

console.log(`Warm theme compliance check passed across ${files.length} files.`);
