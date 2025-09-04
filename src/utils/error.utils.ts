import { err, ok, Result } from "neverthrow";


export type NetworkError = { type: 'network'; message: string; origin: Error };
export type TimeoutError = { type: 'timeout'; message: string };
export type UnknownError = { type: 'unknown'; message: unknown, origin:Error };
export type ProtoError = { type: 'proto'; errors: { [key: string]: string } };
export type HttpError = { type: 'http'; status: number; message: string, origin:Error };
export type AuthError = { type: 'auth', message: string }
export type StateError = { type: 'state', origin?: Error, message: string }
export type ProcessError = { type: 'process', message: string, origin: Error }
export type AppError = NetworkError | TimeoutError | ProtoError | HttpError | UnknownError | StateError | AuthError | ProcessError;

export const tryCatch = function <T, A extends unknown[]>(
    fn: (...args: A) => T,
    ...args: A
): Result<T, Error> {
    try {
        return ok(fn(...args));
    } catch (e) {
        return err(e instanceof Error ? e : new Error(String(e)));
    }
}

