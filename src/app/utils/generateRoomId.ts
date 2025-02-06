const partOne = [
	'big',
	'fat',
	'hot',
	'old',
	'new',
	'bad',
	'wet',
	'dry',
	'raw',
	'juicy',
	'ripe',
	'cold',
	'cool',
	'warm',
	'fast',
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
	'nonbino',
	'agender',
	'genderfluid',
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
	'vix',
	'wolf',
	'ape',
	'ant',
]

export function generateRoomId() {
	return `${partOne[Math.floor(Math.random() * partOne.length)]}-${
		partTwo[Math.floor(Math.random() * partTwo.length)]
	}-${partThree[Math.floor(Math.random() * partThree.length)]}`
}
