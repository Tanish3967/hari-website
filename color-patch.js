const fs = require('fs');
let code = fs.readFileSync('src/app/admin/prescriptions/new/page.tsx', 'utf8');

const colorMap = {
    'slate-50': '#f8fafc',
    'slate-100': '#f1f5f9',
    'slate-200': '#e2e8f0',
    'slate-300': '#cbd5e1',
    'slate-400': '#94a3b8',
    'slate-500': '#64748b',
    'slate-600': '#475569',
    'slate-700': '#334155',
    'slate-800': '#1e293b',
    'slate-900': '#0f172a',
    'white': '#ffffff',
    'black': '#000000',
    'blue-50': '#eff6ff',
    'blue-200': '#bfdbfe',
    'blue-600': '#2563eb',
    'blue-700': '#1d4ed8',
    'red-50': '#fef2f2',
    'red-100': '#fee2e2',
    'red-500': '#ef4444',
    'red-700': '#b91c1c'
};

for (const [name, hex] of Object.entries(colorMap)) {
    const regexText = new RegExp(`text-${name}\\b`, 'g');
    const regexBg = new RegExp(`bg-${name}\\b`, 'g');
    const regexBorder = new RegExp(`border-${name}\\b`, 'g');

    code = code.replace(regexText, `text-[${hex}]`);
    code = code.replace(regexBg, `bg-[${hex}]`);
    code = code.replace(regexBorder, `border-[${hex}]`);
}

fs.writeFileSync('src/app/admin/prescriptions/new/page.tsx', code);
console.log("Successfully replaced all Tailwind aliased colors with Arbitrary Hex equivalents.");
