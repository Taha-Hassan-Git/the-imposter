export type Action =
	| { type: 'toggle-ready'; payload: { id: string } }
	| { type: 'player-joined'; payload: { name: string; id: string } }
	| { type: 'player-voted'; payload: { id: string; vote: string } }
	| { type: 'player-guessed'; payload: { id: string; guess: Answer } }

// const createAvatarColors = (): string[] => {
// 	const NUMBER_OF_AVATAR_COLORS = 12
// 	const ROWS = 3
// 	const COLUMNS = 4

// 	const colors = Array.from(
// 		{ length: NUMBER_OF_AVATAR_COLORS },
// 		(_, i) => `hsl(${Math.round((i * 360) / NUMBER_OF_AVATAR_COLORS)}, 100%, 75%)`
// 	)

// 	const sortingPattern = []
// 	for (let col = 0; col < COLUMNS; col++) {
// 		for (let row = 0; row < ROWS; row++) {
// 			sortingPattern.push(row * COLUMNS + col)
// 		}
// 	}

// 	return sortingPattern.map((index) => colors[index])
// }

// export const avatarColors = createAvatarColors()

export const avatarColors = [
	'hsl(0, 100%, 75%)',
	'hsl(120, 100%, 75%)',
	'hsl(240, 100%, 75%)',
	'hsl(30, 100%, 75%)',
	'hsl(150, 100%, 75%)',
	'hsl(270, 100%, 75%)',
	'hsl(60, 100%, 75%)',
	'hsl(180, 100%, 75%)',
	'hsl(300, 100%, 75%)',
	'hsl(90, 100%, 75%)',
	'hsl(210, 100%, 75%)',
	'hsl(330, 100%, 75%)',
]

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
export type SportsAnswer = (typeof sportsAnswers)[number]

export const answersObject: Record<Category, Answer[]> = {
	films: [...filmAnswers],
	animals: [...animalAnswers],
	countries: [...countryAnswers],
	sports: [...sportsAnswers],
}

export const categoriesArray = ['films', 'animals', 'countries', 'sports'] as const
export type Category = (typeof categoriesArray)[number]

export type Answer = FilmAnswer | AnimalAnswer | CountryAnswer | SportsAnswer

export type GameLoading = { state: 'loading' }

export type GameState = GameInfo | GameLoading
