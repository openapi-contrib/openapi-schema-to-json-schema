import fs from "fs";
import { join } from "path";

export default {
  getSchema,
};

export function getSchema(file) {
  const path = join(__dirname, "schemas", file);
  return JSON.parse(fs.readFileSync(path, "utf8"));
}
