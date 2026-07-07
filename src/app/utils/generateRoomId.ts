const partOne = [
	// Original adjectives
	'big',
	'fat',
	'hot',
	'old',
	'new',
	'wet',
	'dry',
	'juicy',
	'ripe',
	'cold',
	'cool',
	'warm',
	'fast',
	'tiny',
	'huge',
	'wild',
	'calm',
	'bold',
	'shy',
	'loud',
	'soft',
	'kind',
]

const partTwo = [
	'gay',
	'les',
	'bi',
	'queer',
	'trans',
	'ace',
	'pan',
	'poly',
	'nb',
	'aro',
	'enby',
	'omni',
]

const partThree = [
	'bat',
	'bee',
	'cat',
	'cow',
	'dog',
	'fox',
	'hen',
	'owl',
	'pig',
	'rat',
	'ram',
	'ape',
	'ant',
	'elk',
	'bear',
	'deer',
	'seal',
	'hawk',
	'swan',
	'fae',
	'dove',
	'frog',
	'goat',
	'lynx',
	'orca',
	'puma',
]

export function generateRoomId() {
	// Get random elements from each array
	const adj = partOne[Math.floor(Math.random() * partOne.length)]
	const identity = partTwo[Math.floor(Math.random() * partTwo.length)]
	const animal = partThree[Math.floor(Math.random() * partThree.length)]

	const roomId = `${adj}${identity}${animal}`

	return roomId
}
