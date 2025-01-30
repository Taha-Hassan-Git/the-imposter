const partOne = [
	'gay',
	'lesbian',
	'bi',
	'genderqueer',
	'trans',
	'ace',
	'pan',
	'poly',
	'queer',
	'intersex',
	'nonbinary',
	'agender',
	'genderfluid',
]
const partTwo = [
	'unicorn',
	'orangutan',
	'wyvyrn',
	'dragon',
	'phoenix',
	'griffin',
	'pegasus',
	'mermaid',
	'merman',
	'siren',
	'kraken',
	'hippogriff',
	'minotaur',
	'centaur',
	'harpy',
	'sphinx',
	'chimera',
	'gryphon',
]
const partThree = [
	'adventure',
	'attack',
	'awakening',
	'battle',
	'beginning',
	'challenge',
	'clash',
	'conquest',
	'crusade',
	'discovery',
	'encounter',
	'epic',
	'expedition',
	'exploration',
	'fable',
	'fate',
	'journey',
	'legend',
	'myth',
	'odyssey',
	'quest',
	'saga',
	'search',
	'struggle',
	'tale',
	'triumph',
	'victory',
	'voyage',
	'war',
]

export function generateRoomId() {
	return `${partOne[Math.floor(Math.random() * partOne.length)]}-${
		partTwo[Math.floor(Math.random() * partTwo.length)]
	}-${partThree[Math.floor(Math.random() * partThree.length)]}`
}
