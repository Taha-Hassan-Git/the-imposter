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
describe('When in the voting state...', () => {
	it('handles player voting', () => {
		const gameManager = new GameManager(votingGame)

		gameManager.handleAction({
			type: 'player-voted',
			payload: { name: player1Name, vote: player2Name },
		})

		const updatedGame = gameManager.getState()
		const player = updatedGame.players.find((player) => player.name === player1Name)
		const player2 = updatedGame.players.find((player) => player.name === player2Name)
		expect(player?.ready).toBeTruthy()
		expect(player2?.votes).toContain(player1Name)
	})

	it('does not allow a player to vote more than once, and allows players to switch votes', () => {
		const gameManager = new GameManager(votingGame)

		gameManager.handleAction({
			type: 'player-voted',
			payload: { name: player1Name, vote: player2Name },
		})
		gameManager.handleAction({
			type: 'player-voted',
			payload: { name: player1Name, vote: player2Name },
		})

		const updatedGame = gameManager.getState()
		const player2 = updatedGame.players.find((player) => player.name === player2Name)!
		expect(player2.votes.length).toBe(1)
		gameManager.handleAction({
			type: 'player-voted',
			payload: { name: player1Name, vote: player3Name },
		})
		const updatedGame2 = gameManager.getState()
		const player3 = updatedGame2.players.find((player) => player.name === player3Name)!
		const newPlayer2 = updatedGame2.players.find((player) => player.name === player2Name)!
		expect(player3.votes.length).toBe(1)
		expect(newPlayer2.votes.length).toBe(0)
	})

	it('moves to the results state when all players have voted', () => {
		const gameManager = new GameManager(votingGame)
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
		expect(updatedGame.state).toEqual('results')
	})
})
