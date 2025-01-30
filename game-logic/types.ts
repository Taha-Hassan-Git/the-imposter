import { Category } from '../src/app/components/NewGameForm'

export type Action =
	| { type: 'toggle-ready'; payload: { name: string } }
	| { type: 'player-joined'; payload: { name: string } }
	| { type: 'player-left'; payload: { name: string } }
	| { type: 'player-voted'; payload: { name: string; vote: string } }

export const avatarColors: AvatarColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'pink']

export type Player = {
	name: string
	score: number
	ready: boolean
	avatarColor: AvatarColor
	imposter: boolean
	votes: string[]
}
export type AvatarColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink'

export const gameStatesInSequence = ['waiting', 'playing', 'voting', 'results'] as const

export interface GameInfo {
	state: (typeof gameStatesInSequence)[number]
	roomId: string
	players: Player[]
	round: number
	answer: Answer
	prevAnswers: Answer[]
	category: Category
}

export const filmAnswers = [
	'Titanic',
	'The Godfather',
	'Shawshank Redemption',
	'The Dark Knight',
	'Star Wars',
	'Pulp Fiction',
	'The Lord of the Rings',
	'Forrest Gump',
	'The Matrix',
	'Jurassic Park',
	'The Lion King',
	'Terminator',
	'The Avengers',
	'The Silence of the Lambs',
	'The Shining',
	'Harry Potter',
	'The Sixth Sense',
	'The Terminator',
] as const

export type FilmAnswer = (typeof filmAnswers)[number]

export const animalAnswers = [
	'Lion',
	'Elephant',
	'Giraffe',
	'Penguin',
	'Kangaroo',
	'Panda',
	'Tiger',
	'Zebra',
	'Koala',
	'Polar Bear',
	'Hippo',
	'Gorilla',
	'Panda',
	'Monkey',
	'Rhino',
	'Penguin',
	'Polar Bear',
	'Panda',
] as const

export type AnimalAnswer = (typeof animalAnswers)[number]

export const countryAnswers = [
	'Australia',
	'Brazil',
	'Canada',
	'China',
	'Egypt',
	'France',
	'Germany',
	'India',
	'Italy',
	'Japan',
	'Mexico',
	'Russia',
	'Spain',
	'UK',
	'USA',
] as const

export type CountryAnswer = (typeof countryAnswers)[number]

export const sportsAnswers = [
	'Football',
	'Basketball',
	'Tennis',
	'Golf',
	'Rugby',
	'Cricket',
	'Baseball',
	'Hockey',
	'Boxing',
	'F1',
	'Cycling',
	'Swimming',
	'Skiing',
	'Skateboarding',
	'Surfing',
	'Wrestling',
	'Sailing',
	'Diving',
] as const

export const answersObject: Record<Category, Answer[]> = {
	films: [...filmAnswers],
	animals: [...animalAnswers],
	countries: [...countryAnswers],
	sports: [...sportsAnswers],
}

export type SportsAnswer = (typeof sportsAnswers)[number]

export type Answer = FilmAnswer | AnimalAnswer | CountryAnswer | SportsAnswer

export type GameError = { state: 'error' }

export type GameState = GameInfo | GameError
