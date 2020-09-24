import dotenv from "dotenv";

export function envVarReplacer<T>(config: T): T {
  dotenv.config();

  replaceTemplateVars(config);
  return config;
}

function replaceTemplateVars(obj) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        const value = obj[key];
        obj[key] = isTemplatedVar(value)
          ? process.env[extractKeyFromTemplatedVar(value)]
          : value;
      } else if (typeof obj[key] === "object" || Array.isArray(obj[key])) {
        return replaceTemplateVars(obj[key]);
      }
    });
  }
  if (Array.isArray(obj)) {
    return obj.forEach((element, index) => {
      if (typeof element === "string") {
        if (isTemplatedVar(element)) {
          obj[index] = extractKeyFromTemplatedVar(element);
        }
      } else if (typeof element === "object" || Array.isArray(element)) {
        return replaceTemplateVars(element);
      }
    });
  }
}

function isTemplatedVar(value) {
  return value.startsWith("{{") && value.endsWith("}}");
}

function extractKeyFromTemplatedVar(value: string) {
  return value.substring(2, value.length - 2);
}
