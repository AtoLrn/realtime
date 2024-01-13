export interface Question {
    id: string,
    title: string,
    answers: string[],
    selectedOne?: string
}