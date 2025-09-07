import { type CourseWithId, type Course } from "../models/course"
import { err, fromThrowable, ok, ResultAsync, type Result } from "neverthrow"
import type { AppError, ProcessError, StateError } from "../utils/error.utils"
import { compress, decompressAndParse } from "../utils/compression.utils"
import { useToast } from "../context/toast-context"
import { getCourseKey } from "../utils/course.utils"
import type { CourseList, CourseListItem, CourseListItemWithId, CourseMetadata } from "../models/list"
import { getSha256Sum } from "../utils/crypto.utils"
import { decompress } from "fflate"

type LocalStorageKey = "COURSE" | "USER" | "COURSE_ITEM" | "COURSE_LIST"

export type StorageOptions = {
  version: {
    current: string
    prev: string
  }
  additionnalKey: string
}

type MapValue = unknown & {
  dataType: 'Map'
  value: Iterable<[unknown, unknown]>
}

type ValidKey = string

function replacer(key: string, value: MapValue) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
function reviver(key: string, value: MapValue) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

function mustGetCourseStrFromLocalStorage(identifier: string): Result<string, StateError> {
  const item = localStorage.getItem(getStorageKey("COURSE", identifier))
  if (item == null) {
    return err({
      type: "state",
      message: `course was nil for identifier ${identifier}`
    } as StateError)
  }
  return ok(item)
}

function persistCourseListInLocalStorage(cl: CourseList): Result<void, ProcessError> {
  return fromThrowable(() => {
    console.log(cl)
    const str = JSON.stringify(cl, replacer)
    localStorage.setItem("COURSE_LIST", str)
  }, (err) => {
    return {
      type: 'process',
      message: 'could not persist course list',
      origin: err
    } as ProcessError
  })()
}

function getCourseListFromLocalStorage(): Result<CourseList, ProcessError> {
  return fromThrowable(() => {
    const item = localStorage.getItem("COURSE_LIST")
    if (item === null) {
      return {
        ids: new Map()
      }
    }
    return JSON.parse(item, reviver) as CourseList
  }, (err) => {
    return {
      type: 'process',
      message: 'could not get course list',
      origin: err
    } as ProcessError
  })()
}

function getCurrentCourseIdentifierForItemId(identifier: string): Result<string, ProcessError> {
  return fromThrowable(() => {
    const content = localStorage.getItem(getStorageKey("COURSE_ITEM", identifier))
    if (content == null) {
      throw new Error(`item was null for identifier ${identifier}`)
    }
    const item = JSON.parse(content) as CourseListItem
    return item.objectIdentifier
  }, (err) => {
    return {
      type: "process",
      origin: err,
      message: `Error getting the course item : ${err}`,
    } as ProcessError

  })()
}

function getCourseFromLocalStorage(identifier: string): Result<Course, ProcessError> {
  const item = fromThrowable(() => {
    const item = localStorage.getItem(getStorageKey("COURSE", identifier))
    if (item == null) {
      throw new Error(`no course found for identifier ${identifier}`)
    }
    return item
  }, (err) => {
    return {
      type: "process",
      origin: err,
      message: `Error parsing the course : ${err}`,
    } as ProcessError
  })()
  if (item.isErr()) {
    return err(item.error)
  }
  return decompressAndParse<Course>(item.value)
}

function persistCourseItemInLocalStorage(identifier: string, item: CourseListItem) {
  return fromThrowable(() => {
    const str = JSON.stringify(item)
    localStorage.setItem(getStorageKey("COURSE_ITEM", identifier), str)
  }, (err) => {
    return {
      type: 'process',
      message: `Could not persist course item ${item}`,
      origin: err
    } as ProcessError
  })()
}

function getListFromLocalStorage(identifier: string): Result<CourseListItem | null, ProcessError> {
  return fromThrowable(() => {
    const item = localStorage.getItem(getStorageKey("COURSE_ITEM", identifier))
    if (item == null) {
      return null
    }
    return JSON.parse(item) as CourseListItem
  }, (err) => {
    return {
      type: "process",
      origin: err,
      message: `Error parsing the course list item : ${err}`,
    } as ProcessError
  })()
}

function persistCourseInLocalStorage(identifier: string, content: string): Result<void, ProcessError> {
  return fromThrowable(() => {
    localStorage.setItem(getStorageKey("COURSE", identifier), content)
  }, (err) => {
    return {
      type: "process",
      origin: err,
      message: `Error parsing the course list item : ${err}`,
    } as ProcessError
  })()
}

function getStorageKey(key: LocalStorageKey, name: string): ValidKey {
  return `${key}-${name}`
}

export const useCoursePersistence = () => {

  const { showToast } = useToast()

  const persistCourse = (content: Course): ResultAsync<string, AppError> => {
    type CourseData = {
      course: CourseWithId
      courseListItem: CourseListItemWithId
      courseList?: CourseList
      currGzipped?: string
      prevGzipped?: string
    }
    // récupération de la clé d'identification communes aux versions
    return getCourseKey(content)
      .andThen((identifier) =>
        // récupération du potentiel item à partir de son identifiant
        getListFromLocalStorage(identifier)
          .map((item) => {
            return {
              courseListItem: {
                id: identifier,
                item: item
              },
              course: {
                course: content
              }
            } as CourseData
          })
      ).andThen((res) => {
        // récupération du potentiel contenu de la dernière course
        if (res.courseListItem.item != null) {
          return mustGetCourseStrFromLocalStorage(res.courseListItem.id)
            .map((item) => {
              return {
                ...res,
                prevGzipped: item
              }
            })
        }
        return ok(res)
      }).andThen((res) => {
        // compression du contenu de la course actuelle
        const gzipped = compress(res.course.course)
        if (gzipped.isErr()) {
          return err(gzipped.error)
        }
        // arrête si il n'y a pas eu de changement
        if (gzipped.value === res.prevGzipped) {
          return err({
            type: 'state',
            message: 'No change since last version',
          } as StateError)
        }
        return ok({
          ...res,
          currGzipped: gzipped.value
        })
      }).andThen((res) => {
        return getSha256Sum(res.currGzipped)
          .map((identifier) => {
            return {
              course: {
                identifier: identifier,
                course: res.course.course
              },
              courseListItem: {
                id: res.courseListItem.id,
                item: {
                  previousIds: res.courseListItem.item ? [...res.courseListItem.item.previousIds, {
                    id: res.courseListItem.item.objectIdentifier,
                    date: res.courseListItem.item.createdAt
                  }] : [],
                  objectIdentifier: identifier,
                  createdAt: new Date(),
                  version: res.courseListItem.item ? res.courseListItem.item.version + 1 : 1
                }
              },
              currGzipped: res.currGzipped,
              prevGzipped: res.prevGzipped,
            }
          })
      }).andThen((res) => {
        return getCourseListFromLocalStorage().map((cl) => {
          cl.ids.set(res.courseListItem.id, {
            id: res.course.identifier,
            name: res.course.course.name,
            updatedAt: res.courseListItem.item.createdAt,
          })
          return {
            ...res,
            courseList: { ...cl },
          }
        })
      }).andThen((res) =>
        persistCourseInLocalStorage(res.course.identifier, res.currGzipped
        ).andThen(() =>
          persistCourseItemInLocalStorage(res.courseListItem.id, res.courseListItem.item)
        ).andThen(() =>
          persistCourseListInLocalStorage(res.courseList)
        ).andThen(() => {
          return ok(res.course.identifier)
        })
      )
      .orElse((error) => {
        console.error(error)
        showToast(`Could not persist course : ${error.message}`)
        return err(error)
      })
  }

  const getCourse = (identifier: string): Result<CourseWithId, AppError> => {
    const course = getCourseFromLocalStorage(identifier)
    if (course.isErr()) {
      return err(course.error)
    }
    return ok({
      identifier: identifier,
      course: course.value
    })
  }

  const getCourseList = (): Result<CourseMetadata[], AppError> => {
    const cl = getCourseListFromLocalStorage();
    if (cl.isErr()) {
      return err(cl.error)
    }
    const res: CourseMetadata[] = []
    for (const val of cl.value.ids.values()) {
      res.push(val)
    }
    return ok(res)
  }

  return {
    persistCourse,
    getCourse,
    getCourseList,
  }
}
