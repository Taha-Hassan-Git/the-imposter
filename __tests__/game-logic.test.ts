import { GameManager } from '../game-logic/GameManager'
import { Answer, answersObject, GameInfo } from '../game-logic/types'

const player1Name = 'test'
const player2Name = 'test2'
const player3Name = 'test3'

const roomId = 'test'
const category = 'films'
let gameManager: GameManager

describe('When initialising a game...', () => {
	const gameManager = GameManager.createNew({
		playerName: player1Name,
		roomId,
		category,
	})
	const game = gameManager.getState()

	it('returns a game in the waiting state', () => {
		expect(game.state).toEqual('waiting')
	})

	it('returns a game with the correct basic information', () => {
		expect(game.roomId).toEqual(roomId)
		expect(game.category).toEqual(category)
		expect(game.round).toEqual(1)
		expect(game.prevAnswers.length).toBe(0)
	})

	it('returns a game with a valid player', () => {
		expect(game.players.length).toBe(1)
		expect(game.players[0].name).toEqual(player1Name)
		expect(game.players[0].score).toEqual(0)
		expect(game.players[0].ready).toBeFalsy()
	})

	it('returns a game with a valid answer', () => {
		const allAnswers = Object.values(answersObject).flat() as Answer[]
		const answerIsValid = allAnswers.find((answer) => answer == game.answer)
		const answerIsFromCategory = answersObject[category].find((answer) => answer == game.answer)
		expect(game.answer).toBeTruthy()
		expect(answerIsValid).toBeTruthy()
		expect(answerIsFromCategory).toBeTruthy()
	})
})

describe('When in the waiting state...', () => {
	beforeEach(() => {
		gameManager = GameManager.createNew({
			playerName: player1Name,
			roomId,
			category,
		})
	})

	it('can add players', () => {
		gameManager.handleAction({
			type: 'player-joined',
			payload: { name: player2Name },
		})

		const updatedGame = gameManager.getState()
		expect(updatedGame.players.length).toBe(2)
		expect(updatedGame.players[1].name).toEqual(player2Name)
	})

	it('toggles the ready state of players', () => {
		// Toggle ready ON
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { name: player1Name },
		})

		let updatedGame = gameManager.getState()
		const readyPlayer = updatedGame.players[0]
		expect(readyPlayer.ready).toBeTruthy()

		// Toggle ready OFF
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { name: player1Name },
		})

		updatedGame = gameManager.getState()
		const unreadyPlayer = updatedGame.players[0]
		expect(unreadyPlayer.ready).toBeFalsy()
	})

	it('does not start a game if there are not enough players', () => {
		// Add one more player (total 2)
		gameManager.handleAction({
			type: 'player-joined',
			payload: { name: player2Name },
		})

		// Make both players ready
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { name: player1Name },
		})
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { name: player2Name },
		})

		const updatedGame = gameManager.getState()
		expect(updatedGame.state).toEqual('waiting')
	})

	it('starts a game if there are enough players', () => {
		// Add players until we reach minimum (3)
		for (let i = 1; i < gameManager.getMinPlayers(); i++) {
			gameManager.handleAction({
				type: 'player-joined',
				payload: { name: `test${i + 1}` },
			})
		}

		expect(gameManager.getState().state).toEqual('waiting')

		// Toggle ready for all players
		gameManager.getState().players.forEach((player) => {
			if (!player.ready) {
				gameManager.handleAction({
					type: 'toggle-ready',
					payload: { name: player.name },
				})
			}
		})

		const finalGame = gameManager.getState()
		expect(finalGame.state).toEqual('playing')

		// Check that all players are unready after game starts
		const playersReady = finalGame.players.every((player) => player.ready)
		expect(playersReady).toBeFalsy()

		// Verify exactly one imposter
		const impostersCount = finalGame.players.filter((player) => player.imposter).length
		expect(impostersCount).toBe(1)
	})

	it('handles player leaving', () => {
		// Add two more players
		gameManager.handleAction({
			type: 'player-joined',
			payload: { name: player2Name },
		})
		gameManager.handleAction({
			type: 'player-joined',
			payload: { name: player3Name },
		})

		// Make all players ready
		gameManager.getState().players.forEach((player) => {
			gameManager.handleAction({
				type: 'toggle-ready',
				payload: { name: player.name },
			})
		})

		// Game should be in playing state
		expect(gameManager.getState().state).toEqual('playing')

		// Remove a player
		gameManager.handleAction({
			type: 'player-left',
			payload: { name: player3Name },
		})

		const finalGame = gameManager.getState()
		// Game should return to waiting state when below minimum players
		expect(finalGame.state).toEqual('waiting')
		expect(finalGame.players.length).toBe(2)
		// All players should be unready
		expect(finalGame.players.every((player) => !player.ready)).toBeTruthy()
	})
})

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
	beforeEach(() => {
		gameManager = new GameManager(playingGame)
	})
	it('moves to the voting state when all players are ready', () => {
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
		// Remove a player
		gameManager.handleAction({
			type: 'player-left',
			payload: { name: player3Name },
		})

		const finalGame = gameManager.getState()
		expect(finalGame.state).toEqual('waiting')
	})
})

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
	beforeEach(() => {
		gameManager = new GameManager(votingGame)
	})
	it('handles player voting', () => {
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

describe('When in the results state...', () => {
	beforeEach(() => {
		gameManager = new GameManager(votingGame)
	})
	it('awards points to players correctly', () => {
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
			payload: { name: player3Name, vote: player1Name },
		})

		const updatedGame = gameManager.getState()

		const updatedPlayer1 = updatedGame.players.find((player) => player.name === player1Name)!
		const updatedPlayer2 = updatedGame.players.find((player) => player.name === player2Name)!
		const updatedPlayer3 = updatedGame.players.find((player) => player.name === player3Name)!

		// player 1 gets 1 point for voting correctly
		// player 2 gets 3 points for avoiding detection
		// player 3 gets 0 points
		expect(updatedPlayer1.score).toBe(1)
		expect(updatedPlayer2.score).toBe(3)
		expect(updatedPlayer3.score).toBe(0)
	})
})

describe('When starting a new round...', () => {
	const resultsGame: GameInfo = {
		state: 'results',
		roomId: 'test',
		round: 1,
		answer: 'Titanic',
		players: [
			{
				name: 'test',
				score: 1,
				ready: false,
				avatarColor: 'red',
				imposter: false,
				votes: [],
			},
			{
				name: 'test2',
				score: 3,
				ready: false,
				avatarColor: 'blue',
				imposter: true,
				votes: [],
			},
			{
				name: 'test3',
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
	beforeEach(() => {
		gameManager = new GameManager(resultsGame)
	})

	it('starts a new round with a new answer', () => {
		gameManager.getState().players.forEach((player) => {
			gameManager.handleAction({
				type: 'toggle-ready',
				payload: { name: player.name },
			})
		})
		const updatedGame = gameManager.getState()

		expect(updatedGame.round).toBe(2)
		expect(updatedGame.state).toBe('playing')
		expect(updatedGame.answer).not.toEqual(resultsGame.answer)
		expect(updatedGame.prevAnswers).toContain(resultsGame.answer)
	})
})
