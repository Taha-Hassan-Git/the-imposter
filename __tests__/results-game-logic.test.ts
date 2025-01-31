import { GameManager } from '../game-logic/GameManager'
import { GameInfo } from '../game-logic/types'

const player1Name = 'test'
const player2Name = 'test2'
const player3Name = 'test3'
const roomId = 'test'

const votingGame: GameInfo = {
	state: 'voting',
	roomId,
	round: 1,
	answer: 'Titanic',
	players: [
		{
			name: player1Name,
			score: 0,
			ready: false,
			avatarColor: 'red',
			imposter: false,
			votes: [],
		},
		{
			name: player2Name,
			score: 0,
			ready: false,
			avatarColor: 'blue',
			imposter: true,
			votes: [],
		},
		{
			name: player3Name,
			score: 0,
			ready: false,
			avatarColor: 'green',
			imposter: false,
			votes: [],
		},
	],
	prevAnswers: [],
	category: 'films',
}

describe('When in the results state...', () => {
	it('awards points to players who voted correctly', () => {
		const gameManager = new GameManager(votingGame)

		// player 2 is the imposter
		gameManager.handleAction({
			type: 'player-voted',
			payload: { name: player1Name, vote: player2Name },
		})
		gameManager.handleAction({
			type: 'player-voted',
			payload: { name: player2Name, vote: player1Name },
		})
		gameManager.handleAction({
			type: 'player-voted',
			payload: { name: player3Name, vote: player2Name },
		})

		const updatedGame = gameManager.getState()
		const updatedPlayer1 = updatedGame.players.find((player) => player.name === player1Name)!
		const updatedPlayer2 = updatedGame.players.find((player) => player.name === player2Name)!
		const updatedPlayer3 = updatedGame.players.find((player) => player.name === player3Name)!

		expect(updatedPlayer2.score).toBe(0)
		expect(updatedPlayer3.score).toBe(1)
		expect(updatedPlayer1.score).toBe(1)
	})
})
