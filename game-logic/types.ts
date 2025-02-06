import { Category } from '../src/app/components/NewGameForm'

export type Action =
	| { type: 'toggle-ready'; payload: { name: string } }
	| { type: 'player-joined'; payload: { name: string } }
	| { type: 'player-left'; payload: { name: string } }
	| { type: 'player-voted'; payload: { name: string; vote: string } }

// nice pastel colours
export const avatarColors = [
	'#FFC0CB',
	'#FFB6C1',
	'#FF69B4',
	'#FF1493',
	'#DB7093',
	'#C71585',
	'#FFA07A',
	'#FA8072',
	'#E9967A',
	'#F08080',
	'#CD5C5C',
	'#DC143C',
	'#B22222',
	'#8B0000',
	'#FF0000',
	'#FF6347',
	'#FF4500',
	'#FF8C00',
	'#FFA500',
	'#FFD700',
	'#FFFF00',
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
