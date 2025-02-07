import { Category } from '../src/app/components/NewGameForm'

export type Action =
	| { type: 'toggle-ready'; payload: { name: string } }
	| { type: 'player-joined'; payload: { name: string } }
	| { type: 'player-left'; payload: { name: string } }
	| { type: 'player-voted'; payload: { name: string; vote: string } }

// nice pastel colours
export const avatarColors = [
	'#FFA07A',
	'#FFD700',
	'#FF69B4',
	'#F5A7A6',
	'#F5CF9F',
	'#F3F5A9',
	'#FF1493',
	'#FF6347',
	'#D5D1E9',
	'#B5EAD7',
	'#A2D2FF',
	'#FFD1DC',
] as const

export type Player = {
	name: string
	score: number
	ready: boolean
	avatarColor: AvatarColor
	imposter: boolean
	votes: string[]
}
export type AvatarColor = (typeof avatarColors)[number]

export type StateNames = 'waiting' | 'playing' | 'voting' | 'results'

export interface GameInfo {
	state: StateNames
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
	'Inception',
	'Monsters Inc.',
	'Star Wars',
	'Pulp Fiction',
	'Fight Club',
	'Forrest Gump',
	'The Matrix',
	'Jurassic Park',
	'The Lion King',
	'Terminator',
	'The Avengers',
	'Avatar',
	'The Shining',
	'Harry Potter',
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
	'Wolf',
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
	'South Africa',
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
] as const

export const answersObject: Record<Category, Answer[]> = {
	films: [...filmAnswers],
	animals: [...animalAnswers],
	countries: [...countryAnswers],
	sports: [...sportsAnswers],
}

export type SportsAnswer = (typeof sportsAnswers)[number]

export type Answer = FilmAnswer | AnimalAnswer | CountryAnswer | SportsAnswer

export type GameError = { state: 'loading' }

export type GameState = GameInfo | GameError
