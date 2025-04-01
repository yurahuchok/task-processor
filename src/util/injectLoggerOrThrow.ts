import { inject } from "../bootstrap/inject";

export async function injectLoggerOrThrow() {
  try {
    return await inject().Logger();
  } catch (error) {
    console.log("Failed to inject Logger instance for error handling.");
    throw new Error("Internal Server Error");
  }
}
