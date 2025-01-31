import { GameManager } from '../game-logic/GameManager'
import { GameInfo } from '../game-logic/types'

const player1Name = 'test'
const player2Name = 'test2'
const player3Name = 'test3'
const roomId = 'test'

describe('When in the playing state...', () => {
	const playingGame: GameInfo = {
		state: 'playing',
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
	it('moves to the voting state when all players are ready', () => {
		const gameManager = new GameManager(playingGame)
		// All players are ready
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { name: player1Name },
		})

		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { name: player2Name },
		})
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { name: player3Name },
		})
		const newState = gameManager.getState()
		expect(newState.state).toEqual('voting')
	})

	it('returns to the waiting state if there are not enough players', () => {
		const gameManager = new GameManager(playingGame)
		// Remove a player
		gameManager.handleAction({
			type: 'player-left',
			payload: { name: player3Name },
		})

		const finalGame = gameManager.getState()
		expect(finalGame.state).toEqual('waiting')
	})
})
