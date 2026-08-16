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
  if (content.includes('apiFetch(') && !content.includes('import { apiFetch }')) {
    if (content.startsWith('"use client";\n')) {
      content = '"use client";\nimport { apiFetch } from "@/lib/api";\n' + content.substring('"use client";\n'.length);
    } else if (content.startsWith("'use client';\n")) {
      content = "'use client';\nimport { apiFetch } from \"@/lib/api\";\n" + content.substring("'use client';\n".length);
    } else {
      content = 'import { apiFetch } from "@/lib/api";\n' + content;
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Added import to ' + file);
    count++;
  }
});
console.log('Total fixed: ' + count);
