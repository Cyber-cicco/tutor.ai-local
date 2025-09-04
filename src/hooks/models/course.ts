export type Course = {
    name: string
    topic: string
    done: boolean
    level: CourseLevel
    modules: Module[]
}

export type CourseLevel = "ABSOLUTE_BEGINNER" | "NOVICE" | "JUNIOR" | "MID_LEVEL" | "ADVANCED" | "EXPERT"


export type Module = {
    title: string
    description: string
    content: string
    done: boolean
    exercises: Exercise[]
}

export type Exercise = QCM | Practise

export type QCMQuestion = {
    question: string
    responses: QCMResponse[]
}

export type QCM = {
    questions: QCMQuestion
    done: boolean
}

export type QCMResponse = {
    content: string
    rightAnswer: boolean
}

export type Practise = {

}
