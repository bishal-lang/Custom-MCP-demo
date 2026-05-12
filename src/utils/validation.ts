import { ValidationError } from "./errors.js";
import AjvImport from "ajv";

/**
 * Ensures required fields exist in tool args
 */
export function requireFields(
  obj: Record<string, any>,
  fields: string[]
) {
  for (const field of fields) {
    if (
      obj[field] === undefined ||
      obj[field] === null ||
      obj[field] === ""
    ) {
      throw new ValidationError(
        `Missing required field: ${field}`
      );
    }
  }
}

/**
 * Validates string field
 */
export function assertString(
  value: unknown,
  fieldName: string
): asserts value is string {
  if (typeof value !== "string") {
    throw new ValidationError(
      `${fieldName} must be a string`
    );
  }
}

/**
 * Validates array of strings
 */
export function assertStringArray(
  value: unknown,
  fieldName: string
): asserts value is string[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(
      `${fieldName} must be an array`
    );
  }

  for (const item of value) {
    if (typeof item !== "string") {
      throw new ValidationError(
        `${fieldName} must contain only strings`
      );
    }
  }
}



const Ajv = (AjvImport as unknown as { default?: unknown }).default ?? AjvImport;

const ajv = new (Ajv as any)();

export function validateSchema<T>(
  schema: object,
  data: unknown
): T {
  const validate = ajv.compile(schema);

  const valid = validate(data);

  if (!valid) {
    throw new Error(
      "Validation error: " +
        JSON.stringify(validate.errors, null, 2)
    );
  }

  return data as T;
}