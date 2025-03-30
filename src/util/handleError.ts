import { TaskDuplicateError } from "../error/TaskDuplicateError";
import { TaskProcessingError } from "../error/TaskProcessingError";
import { DynamoDBClientError } from "../error/DynamoDBClientError";
import { TaskValidationError } from "../error/TaskValidationError";
import { EnvironmentConfigError } from "../error/EnvironmentConfigError";

type SupportedError =
  | DynamoDBClientError
  | TaskDuplicateError
  | TaskProcessingError
  | EnvironmentConfigError
  | TaskValidationError;

export function handleError(error: SupportedError) {
  switch (error._type) {
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Internal Server Error",
    }),
  };
}
