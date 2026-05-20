export interface Question {
  id: string
  label: string
}

export interface AnswerResult {
  correct: boolean
  correctAnswer: string
  submittedAnswer: string
  answeredBy: string
}

export interface EloChange {
  old: number
  new: number
}

export interface XpUpdate {
  newXp: number
  newLevel: number
  leveledUp: boolean
}
