const funnyAdjectives = ['juicy', 'slippery', 'obnoxious', 'sassy', 'fluffy', 'heartfelt']

const funnyNouns = ['weirdo', 'friend', 'chameleon', 'penguin', 'unicorn', 'panda']

export function generatePlayerName() {
	const adjective = funnyAdjectives[Math.floor(Math.random() * funnyAdjectives.length)]
	const noun = funnyNouns[Math.floor(Math.random() * funnyNouns.length)]
	return `${adjective}-${noun}`
}
