export type Action =
	| { type: 'toggle-ready'; payload: { name: string } }
	| { type: 'player-joined'; payload: { name: string; id: string } }
	| { type: 'player-left'; payload: { name: string } }
	| { type: 'player-voted'; payload: { name: string; vote: string } }
	| { type: 'player-guessed'; payload: { name: string; guess: Answer } }

const createAvatarColors = (): string[] => {
	const NUMBER_OF_AVATAR_COLORS = 12
	const ROWS = 3
	const COLUMNS = 4

	const colors = Array.from(
		{ length: NUMBER_OF_AVATAR_COLORS },
		(_, i) => `hsl(${Math.round((i * 360) / NUMBER_OF_AVATAR_COLORS)}, 100%, 75%)`
	)

	const sortingPattern = []
	for (let col = 0; col < COLUMNS; col++) {
		for (let row = 0; row < ROWS; row++) {
			sortingPattern.push(row * COLUMNS + col)
		}
	}

	return sortingPattern.map((index) => colors[index])
}

export const avatarColors = createAvatarColors()

export type Player = {
	name: string
	id: string
	score: number
	ready: boolean
	avatarColor: AvatarColor
	imposter: boolean
	guess: Answer | null
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
	'Leopard',
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

export type Category = 'films' | 'animals' | 'countries' | 'sports'

export const categoriesArray: Array<Category> = ['films', 'animals', 'countries', 'sports']

export type SportsAnswer = (typeof sportsAnswers)[number]

export type Answer = FilmAnswer | AnimalAnswer | CountryAnswer | SportsAnswer

export type GameError = { state: 'loading' }

export type GameState = GameInfo | GameError
