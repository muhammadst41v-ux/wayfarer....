import fs from 'fs';
import path from 'path';
import https from 'https';

console.log('🔍 [Wayfarer Image Audit Tool] Scanning codebase for image references...');

function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = findFiles('src');
const urlRegex = /https:\/\/[^\s"'`,)]+/g;
const urlsToCheck = new Set();
const urlSourceMap = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[0];
    if (
      (url.includes('images.unsplash.com') ||
        url.includes('wikimedia.org') ||
        url.includes('wikipedia.org')) &&
      !url.includes('...')
    ) {
      urlsToCheck.add(url);
      if (!urlSourceMap.has(url)) urlSourceMap.set(url, []);
      urlSourceMap.get(url).push(file);
    }
  }
}

console.log(`Found ${urlsToCheck.size} unique image URLs to audit.`);

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(
      url,
      {
        method: 'HEAD',
        headers: {
          'User-Agent': 'WayfarerImageAuditor/1.0 (info@wayfarer.travel)',
        },
      },
      (res) => {
        resolve({ url, status: res.statusCode });
      }
    );
    req.on('error', (err) => resolve({ url, status: `ERROR: ${err.message}` }));
    req.setTimeout(5000, () => {
      req.abort();
      resolve({ url, status: 'TIMEOUT' });
    });
    req.end();
  });
}

async function audit() {
  const list = Array.from(urlsToCheck);
  const failed = [];
  const batchSize = 10;

  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(checkUrl));
    for (const res of results) {
      if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
        failed.push({
          url: res.url,
          status: res.status,
          files: urlSourceMap.get(res.url) || [],
        });
      }
    }
  }

  console.log('\n========================================');
  console.log(`  AUDIT SUMMARY: ${failed.length} FAILED URLs`);
  console.log('========================================\n');

  if (failed.length === 0) {
    console.log('✅ All verified URLs are returning HTTP 200/300 status!');
  } else {
    failed.forEach((f, idx) => {
      console.log(`[${idx + 1}] Status: ${f.status} | URL: ${f.url}`);
      console.log(`    Found in: ${f.files.join(', ')}`);
    });
  }
}

audit();
