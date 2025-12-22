import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";

// make sure CLOUDFLARE_ZONE_ID is set as environment variable
if (!("CLOUDFLARE_ZONE_ID" in process.env)) {
  console.log("CLOUDFLARE_ZONE_ID is not available. Please set it as an environment variable.");
  process.exit(1);
}
// make sure CLOUDFLARE_API_TOKEN is set as environment variable
if (!("CLOUDFLARE_API_TOKEN" in process.env)) {
  console.log("CLOUDFLARE_API_TOKEN is not available. Please set it as an environment variable.");
  process.exit(1);
}

const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID } = process.env;

// if no directory was provided, exit
if (process.argv.length < 4) {
  console.log(
    "Please provide a path to a directory of files that are being deployed and a slug of the folder to which they're being deployed.\nThis should appread like the following command:\nnode purge.js local-folder-name remote-folder-name --environment"
  );

  process.exit(1);
}

const deployPaths = {
  dev: "https://apps-staging.urban.org/features",
  staging: "https://apps-staging.urban.org/features",
  production: "https://apps.urban.org/features"
};

let deployEnv = "production";

if (process.argv.length > 4) {
  const modeFlag = process.argv[4].substr(2);
  if (Object.keys(deployPaths).includes(modeFlag)) {
    deployEnv = modeFlag;
  } else {
    console.log(
      "environment flag not reccognized please use one of --production, --staging, or --dev"
    );
    process.exit(1);
  }
}

// what directory (relative to the project root) is being deployed? provided as the first command line argument
const deployDir = process.argv[2];

// what directory are we deploying to on the server?
const deploySlug = process.argv[3];

// build absolute path to the deploy directory
const targetDir = path.resolve(process.cwd(), deployDir);

/**
 * Retrieve list of all files that are being deployed
 * @async
 * @param {string} dir The path of the directory to search
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths relative to the dir
 */
async function getFiles(dir) {
  let files = await fs.readdir(dir, { withFileTypes: true });
  let filePaths = [];

  for (let file of files) {
    let fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // If it's a directory, recursively get files
      filePaths = filePaths.concat(await getFiles(fullPath));
    } else {
      // remove the targetDir from the path so that everything is relative
      const cleanPath = path.relative(targetDir, fullPath);
      // If it's a file, push to the array
      filePaths.push(cleanPath);
    }
  }
  // return full list of file paths
  return filePaths;
}

/**
 * @param {Array} array The array to chunk
 * @param {number} chunkSize The size of each chunk
 * @returns {Array} An array of arrays, each containing chunkSize elements
 */
function chunkArray(items, chunkSize) {
  const chunkedArr = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    // Create a slice of array from i to i + chunkSize
    const chunk = items.slice(i, i + chunkSize);
    chunkedArr.push(chunk);
  }
  return chunkedArr;
}

/**
 * @param {string} filePath - The local filepath to base the URL on
 * @param {"dev" | "staging" | "production"} env - The environment that needs to be purged. This affects the base path of the URL.
 * @returns {string} The resulting absolute URL for a given file and env
 */
function getUrl(filePath) {
  return `${deployPaths[deployEnv]}/${deploySlug}/${filePath}`;
}

async function makeApiRequest(files) {
  // api end point based on CLOUDFLARE_ZONE_ID
  const apiEndpoint = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`;

  const requestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
    },
    body: JSON.stringify({ files })
  };
  // make POST request to endpoint with provided files and CLOUDFLARE_API_TOKEN
  const response = await fetch(apiEndpoint, requestConfig);
  // check if API call succeeded, throw error if not
  if (response.ok) {
    const responseData = await response.json();
    if (responseData.success) {
      console.log("Successfully purged:", files);
      return;
    }
  }
  console.error("API request was unsuccessful: ");
  console.error(response);
  throw new Error(response);
}

async function main() {
  // get list of files
  const files = await getFiles(targetDir);
  // filter out HTML and convert local paths to absolute URLs based on deployEnv
  const urlsToPurge = files.filter((file) => !file.endsWith(".html")).map(getUrl);

  // chunk files into arrays of 30 or fewer items
  // https://developers.cloudflare.com/api/operations/zone-purge#purge-cached-content-by-url
  const purgeChunks = chunkArray(urlsToPurge, 30);
  for (let urls of purgeChunks) {
    // Call Cloudflare API for this chunk of URLs
    await makeApiRequest(urls);
  }
}

main();
