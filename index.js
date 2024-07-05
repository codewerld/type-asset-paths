const fs = require("fs");
const path = require("path");

function loadConfig() {
  try {
    const currentDir = process.cwd();
    const configPath = path.join(currentDir, 'assetPaths.json');
    console.log('Config path:', configPath);

    if (!fs.existsSync(configPath)) {
      throw new Error('Configuration file assetPaths.json not found in the current directory.');
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('Failed to load configuration:', error);
    throw error;
  }
}

function generatePathTypes(assets) {
  const assetPaths = assets.map(asset => `"${"./"+asset}"`).join(" | ");
  return `export type AssetPath = ${assetPaths};
`;
}

function findAssets(baseDir, directory, extensions) {
  const assets = [];
  const fullPath = path.join(baseDir, directory);
  const files = fs.readdirSync(fullPath);

  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      assets.push(...findAssets(baseDir, path.join(directory, file), extensions));
    } else if (extensions.includes(path.extname(file))) {
      // Create a path relative to the base directory
      const relativePath = path.join(directory, file).replace(/\\/g, '/');
      assets.push(relativePath);
    }
  }

  return assets;
}

async function main() {
  try {
    const config = await loadConfig();
    const baseDir = process.cwd();
    const assets = config.entryFiles.flatMap((entry) =>
      findAssets(baseDir, entry, config.assetExtensions)
    );
    const pathTypes = generatePathTypes(assets);

    const outputPath = path.resolve(baseDir, config.outputPaths || "./assetPaths.ts");
    fs.writeFileSync(outputPath, pathTypes);
    console.log(`${outputPath} has been generated successfully.`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = main;