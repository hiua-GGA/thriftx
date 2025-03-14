const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { exec } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    description: 'URL to test',
    default: 'http://localhost:3000',
    type: 'string',
  })
  .option('routes', {
    alias: 'r',
    description: 'Routes to test (comma separated)',
    default: '/',
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    description: 'Output directory for reports',
    default: './lighthouse-reports',
    type: 'string',
  })
  .option('threshold', {
    alias: 't',
    description: 'Performance score threshold (0-100)',
    default: 80,
    type: 'number',
  })
  .help()
  .alias('help', 'h')
  .argv;

// Create output directory if it doesn't exist
const outputDir = path.resolve(process.cwd(), argv.output);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Routes to test
const routes = argv.routes.split(',').map(route => route.trim());

// Lighthouse configuration
const config = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
  },
};

// Function to run Lighthouse
async function runLighthouse(url, route) {
  console.log(`\nTesting ${url}${route}...`);
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  try {
    // Run Lighthouse
    const { lhr } = await lighthouse(`${url}${route}`, {
      port: chrome.port,
      output: 'html',
      logLevel: 'info',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    }, config);
    
    // Generate report filename
    const routeName = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
    const dateStr = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const reportPath = path.join(outputDir, `${routeName}-${dateStr}.html`);
    
    // Save report
    fs.writeFileSync(reportPath, lhr.report);
    
    // Log results
    console.log('\nLighthouse scores:');
    console.log(`Performance: ${Math.round(lhr.categories.performance.score * 100)}`);
    console.log(`Accessibility: ${Math.round(lhr.categories.accessibility.score * 100)}`);
    console.log(`Best Practices: ${Math.round(lhr.categories['best-practices'].score * 100)}`);
    console.log(`SEO: ${Math.round(lhr.categories.seo.score * 100)}`);
    console.log(`\nReport saved to: ${reportPath}`);
    
    // Check if performance is below threshold
    if (lhr.categories.performance.score * 100 < argv.threshold) {
      console.warn(`\n⚠️ Warning: Performance score is below threshold of ${argv.threshold}`);
      return {
        route,
        passed: false,
        scores: {
          performance: Math.round(lhr.categories.performance.score * 100),
          accessibility: Math.round(lhr.categories.accessibility.score * 100),
          bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
          seo: Math.round(lhr.categories.seo.score * 100),
        },
      };
    }
    
    return {
      route,
      passed: true,
      scores: {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
      },
    };
  } finally {
    // Close Chrome
    await chrome.kill();
  }
}

// Main function
async function main() {
  console.log('Starting Lighthouse performance tests...');
  console.log(`Base URL: ${argv.url}`);
  console.log(`Routes to test: ${routes.join(', ')}`);
  console.log(`Performance threshold: ${argv.threshold}`);
  
  const results = [];
  let failedTests = 0;
  
  // Run tests for each route
  for (const route of routes) {
    try {
      const result = await runLighthouse(argv.url, route);
      results.push(result);
      
      if (!result.passed) {
        failedTests++;
      }
    } catch (error) {
      console.error(`Error testing route ${route}:`, error);
      results.push({
        route,
        passed: false,
        error: error.message,
      });
      failedTests++;
    }
  }
  
  // Generate summary report
  const summaryPath = path.join(outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    baseUrl: argv.url,
    threshold: argv.threshold,
    results,
  }, null, 2));
  
  console.log(`\nSummary report saved to: ${summaryPath}`);
  
  // Exit with appropriate code
  if (failedTests > 0) {
    console.log(`\n❌ ${failedTests} route(s) failed to meet the performance threshold.`);
    process.exit(1);
  } else {
    console.log('\n✅ All routes passed performance tests!');
    process.exit(0);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error running performance tests:', error);
  process.exit(1);
}); 