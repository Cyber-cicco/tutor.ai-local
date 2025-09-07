export type CourseWithId = {
    course: Course,
    identifier: string,
}

export type Course = {
    name: string
    topic: string
    author: string
    level: CourseLevel
    modules: Module[]
}

export type CourseLevel = "ABSOLUTE_BEGINNER" | "NOVICE" | "JUNIOR" | "MID_LEVEL" | "ADVANCED" | "EXPERT"


export type Module = {
    title: string
    description: string
    content: string
    language: Language
    exercises: Exercise[]
}

export type Language = "FR" | "EN" | "ESP" | "ITA" | "GER"

export type Exercise = QCM | Practise

export type QCMQuestion = {
    question: string
    responses: QCMResponse[]
}

export type QCM = {
    title: string
    type: 'QCM'
    questions: QCMQuestion[]
}

export type QCMResponse = {
    content: string
    rightAnswer: boolean
}

export type Practise = {
    title:string
    type:'PRACTICE'
    content: string
    correction: string
}
