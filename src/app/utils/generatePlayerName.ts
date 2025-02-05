const funnyAdjectives = ['Juicy', 'Slippery', 'Obnoxious', 'Sassy', 'Fluffy', 'Heartfelt']

const funnyNouns = ['Weirdo', 'Friend', 'Chameleon', 'Penguin', 'Unicorn', 'Panda']

export function generatePlayerName() {
	const adjective = funnyAdjectives[Math.floor(Math.random() * funnyAdjectives.length)]
	const noun = funnyNouns[Math.floor(Math.random() * funnyNouns.length)]
	return `${adjective} ${noun}`
}
