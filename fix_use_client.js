const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app/dashboard');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.startsWith('import { apiFetch }') && content.includes('"use client"')) {
    // We need to move the 'use client' directive to the very first line.
    // It could be '"use client";\r\n' or '"use client"\n' etc.
    const useClientRegex = /^import \{ apiFetch \} from "@\/lib\/api";\r?\n(["']use client["'];?\r?\n)/;
    if (useClientRegex.test(content)) {
        content = content.replace(useClientRegex, '$1import { apiFetch } from "@/lib/api";\n');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed ' + file);
        count++;
    }
  }
});
console.log('Total fixed: ' + count);
