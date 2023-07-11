#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { openapiSchemaToJsonSchema } from "./index.js";
import fs from "fs/promises";
import * as process from "process";
import type { AcceptibleInputSchema } from "./openapi-schema-types";
const args = yargs(hideBin(process.argv))
  .options({
    input: { type: "string", alias: "f", demandOption: true },
    output: { type: "string", alias: "o" },
  })
  .parseSync();

const { input, output } = args;

const getFileContents = async () => {
  try {
    const fileContents = await fs.readFile(input, "utf-8");
    return JSON.parse(fileContents) as AcceptibleInputSchema;
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
};

(async () => {
  try {
    const fileContents = await getFileContents();
    const convertedSchema = await openapiSchemaToJsonSchema(fileContents);
    const outputFile = output || input.replace(/\.json$/, "-converted.json");
    await fs.writeFile(outputFile, JSON.stringify(convertedSchema, null, 2));
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
  }
})();
