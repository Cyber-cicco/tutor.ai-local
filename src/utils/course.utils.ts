import type { ResultAsync } from "neverthrow";
import type { Course } from "../models/course";
import { getSha256Sum } from "./crypto.utils";
import type { ProcessError } from "./error.utils";

export function getCourseKey(course: Course): ResultAsync<string, ProcessError> {
    return getSha256Sum(`${course.name}${course.level}${course.topic}${course.author}`)
}
