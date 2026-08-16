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
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  if (content.includes('fetch(') || content.includes('fetch(`/api')) {
    // We want to replace fetch("/api... or fetch(`/api... with apiFetch("/api...
    // Match fetch( followed by whitespace then ' or " or ` then /api
    content = content.replace(/fetch\(\s*(["'`])\/api/g, 'apiFetch($1/api');
    
    if (content !== original && !content.includes('apiFetch')) {
       const importMatch = content.match(/import .* from .*;/g);
       if (importMatch) {
         const lastImport = importMatch[importMatch.length - 1];
         content = content.replace(lastImport, lastImport + '\nimport { apiFetch } from "@/lib/api";');
       } else {
         content = 'import { apiFetch } from "@/lib/api";\n' + content;
       }
    }
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated ' + file);
      updatedCount++;
    }
  }
});
console.log('Total files updated: ' + updatedCount);
