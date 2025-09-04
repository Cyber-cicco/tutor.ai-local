import { ResultAsync } from "neverthrow";
import { type ProcessError } from "./error.utils";

/**
 * Computes the SHA-256 hash of the given string
 */
export function getSha256Sum(input: string): ResultAsync<string, ProcessError> {
    return ResultAsync.fromPromise(window.crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(input)
    ), (error) => {
        return {
            type: 'process',
            message: 'Failed to encode string',
            origin: error
        } as ProcessError;
    }).map((hashBuffer) =>
        Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0')).join('')
    )
}
