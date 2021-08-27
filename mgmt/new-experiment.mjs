#!/usr/bin/env zx
import { question } from "zx";

let experimentName;

// Enforce that an experimentName is chosen
const enforceExperimentName = async () => {
  if (!experimentName) {
    experimentName = await question(chalk.blue("Experiment name? "));
    await enforceExperimentName();
  }
};

// Bit of a hack to prevent eol errors from showing on GH
const withEol = (str) => {
  return `${str}
`;
};

await enforceExperimentName();

// Replace all spaces with dashes
if (experimentName.includes(" ")) {
  const allSpacesRegex = new RegExp(" ", "g");
  experimentName = experimentName.replace(allSpacesRegex, "-");
}

// Create the package directory, and use my minimal vite-template as scaffolding
console.log(chalk.blueBright(`-- creating ”${experimentName}”`));
const packagePath = `packages/${experimentName}`;
await $`mkdir ${packagePath} && cd ${packagePath} && npx degit https://github.com/smhutch/vite-template`;

// Override the package.json file to use the experiment name
console.log(chalk.blueBright(`-- updating package.json`));
const configFilePath = `${packagePath}/package.json`;
const config = await fs.readFile(configFilePath);
const packageJson = JSON.parse(config);
packageJson.name = experimentName;
await fs.writeFile(
  configFilePath,
  withEol(JSON.stringify(packageJson, null, 2))
);

// Override the README.md to use the experiment name
console.log(chalk.blueBright(`-- updating README.md`));
const readmePath = `${packagePath}/README.md`;
await fs.writeFile(readmePath, withEol(`# ${experimentName}`));

// Remove yarn.lock from the package, since we're using it in a yarn workspace now
console.log(chalk.blueBright(`-- removing yarn.lock`));
await $`rm ${packagePath}/yarn.lock`;
