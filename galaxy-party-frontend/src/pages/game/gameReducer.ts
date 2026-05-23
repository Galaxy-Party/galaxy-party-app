import type { Room } from '../../types/room/models'
import type { AnswerResult, EloChange, Question, XpUpdate } from './types'

/**
 * Discrete, event-driven state of a game (the quiz "protocol").
 * Note: the live per-player clock (`playerTimes`) is intentionally NOT here — it
 * ticks every second with a side effect (`game:time_up`) and lives as local state
 * in `useGameSession`. This reducer only models the discrete server transitions.
 */
export interface GameState {
  room: Room | null
  countdown: number | null
  currentPlayerId: string | null
  question: Question | null
  answerResult: AnswerResult | null
  winnerId: string | null
  isRanked: boolean
  eloChange: EloChange | null
  xpUpdate: XpUpdate | null
}

export function initialGameState(isRanked: boolean): GameState {
  return {
    room: null,
    countdown: null,
    currentPlayerId: null,
    question: null,
    answerResult: null,
    winnerId: null,
    isRanked,
    eloChange: null,
    xpUpdate: null,
  }
}

export type GameAction =
  | { type: 'ROOM_DETAILS'; room: Room }
  | { type: 'COUNTDOWN'; count: number }
  | { type: 'GAME_STARTED'; currentPlayerId: string }
  | { type: 'QUESTION'; question: Question; currentPlayerId: string }
  | { type: 'ANSWER_RESULT'; result: AnswerResult }
  | { type: 'GAME_OVER'; winnerId: string | null }
  | { type: 'SESSION_STARTED' }
  | { type: 'ELO_UPDATED'; newElo: number; currentElo: number }
  | { type: 'XP_UPDATED'; xp: number; level: number; leveledUp: boolean }

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROOM_DETAILS':
      return { ...state, room: action.room }
    case 'COUNTDOWN':
      return { ...state, countdown: action.count }
    case 'GAME_STARTED':
      return { ...state, currentPlayerId: action.currentPlayerId, countdown: null }
    case 'QUESTION':
      return { ...state, question: action.question, currentPlayerId: action.currentPlayerId, answerResult: null }
    case 'ANSWER_RESULT':
      return { ...state, answerResult: action.result }
    case 'GAME_OVER':
      return { ...state, winnerId: action.winnerId }
    case 'SESSION_STARTED':
      return { ...state, isRanked: true }
    case 'ELO_UPDATED':
      return { ...state, eloChange: { old: state.eloChange?.new ?? action.currentElo, new: action.newElo } }
    case 'XP_UPDATED':
      return { ...state, xpUpdate: { newXp: action.xp, newLevel: action.level, leveledUp: action.leveledUp } }
    default:
      return state
  }
}
