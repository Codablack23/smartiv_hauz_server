/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

interface ErrorsObject {
  [key: string]: string;
}

function extractErrors(errors: ValidationError[], parentPath = ''): ErrorsObject {
  const result: ErrorsObject = {};

  for (const error of errors) {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      const messages = Object.values(error.constraints);
      if (messages.length) result[path] = messages[0]; // Only first error message
    }

    if (error.children && error.children.length > 0) {
      const childErrors = extractErrors(error.children, path);
      Object.assign(result, childErrors);
    }
  }

  return result;
}

export const useValidationException = (validationErrors: ValidationError[]) => {
  const errors = extractErrors(validationErrors);

  return new BadRequestException({
    errors,
    status: "failed",
    message: Object.values(errors)[0] || "Validation failed",
    data: null,
  });
};