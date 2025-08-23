const replace = require('replace-in-file');
const newVersion = Date.now(); // Use a timestamp for the new version

const options = {
  // Target all HTML files in the docs directory and its subdirectories
  files: 'docs/**/*.html',
  // Regex to find any existing version string like ?v=1.4 or ?v=123456789
  from: /\?v=[0-9.]+/g,
  // Replace with the new timestamp version
  to: `?v=${newVersion}`,
};

try {
  const results = replace.sync(options);
  console.log('Successfully updated version to', newVersion, 'in the following files:', results.filter(r => r.hasChanged).map(r => r.file));
} catch (error) {
  console.error('Error occurred while updating versions:', error);
}