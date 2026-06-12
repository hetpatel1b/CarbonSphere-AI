const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');
const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip dashboardService because we want to preserve its interface or maybe update it manually later
  if (file === 'dashboardService.ts') return;

  // Add import if not exists
  if (!content.includes("fetchWithCache")) {
    content = `import { fetchWithCache } from '../utils/apiCache';\n` + content;
  }

  // Replace await fetch(URL, GET_OPTIONS)
  // Example: const response = await fetch(`${API_URL}/community/stats`, { headers: getHeaders() });
  // if (!response.ok) throw new Error('...');
  // return response.json();
  
  // We can use a regex to replace fetch and remove the .ok checks, but that is risky.
  // Instead, since fetchWithCache returns the parsed JSON directly:
  // old: 
  // const response = await fetch(URL, OPTIONS);
  // if (!response.ok) throw ...
  // return response.json();
  
  // new:
  // return fetchWithCache(URL, OPTIONS);
  
});
