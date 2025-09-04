import { gunzipSync, gzipSync, strFromU8, strToU8 } from "fflate";
import { ok, Result } from 'neverthrow';
import { tryCatch as fromThrowable, type ProcessError } from "../utils/error.utils";

export function compress(data: unknown): Result<string, ProcessError> {
    return fromThrowable(JSON.stringify, data)
        .andThen((jsonString) =>
            fromThrowable(() => gzipSync(strToU8(jsonString)))
        ).andThen((data) =>
            fromThrowable(() => btoa(String.fromCharCode(...data)))
        ).mapErr((err) => ({
            type: 'process' as const,
            message: `Error compressing data: ${data}\norigin: ${err.message}`,
            origin: err
        }));
};

export function decompress<T>(compressed: string) {
    return fromThrowable(atob, compressed)
        .andThen((decoded) =>
            ok(new Uint8Array(decoded.split('').map(c => c.charCodeAt(0))))
        ).andThen((buffer) =>
            fromThrowable(() => gunzipSync(buffer))
        ).andThen((decompressed) =>
            fromThrowable(() => strFromU8(decompressed))
        ).andThen((jsonString) =>
            fromThrowable(() => JSON.parse(jsonString) as T)
        ).mapErr((err) => ({
            type: 'process' as const,
            message: `Error decompressing data\norigin: ${err.message}`,
            origin: err
        }))
}
