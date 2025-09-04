export type CourseListItem = {
    version: number
    createdAt: Date
    objectIdentifier: string
    previousIds: {
        id:string
        date:Date
    }[]
}

export type CourseListItemWithId = {
    item: CourseListItem | null
    id: string
}

export type CourseList = {
    ids: Map<string, CourseMetadata>
}

export type CourseMetadata = {
    id:string
    name:string
    updatedAt: Date
}
