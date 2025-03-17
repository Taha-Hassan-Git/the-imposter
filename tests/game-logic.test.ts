import { GameManager } from '../game-logic/GameManager'
import { Answer, answersObject, avatarColors, GameInfo } from '../game-logic/types'

// Constants for player names
const PLAYER_1 = 'player1'
const PLAYER_2 = 'player2'
const PLAYER_3 = 'player3'

// Test constants
const ROOM_ID = 'test-room'
const CATEGORY = 'films'
const TEST_ANSWER = 'Titanic'

let gameManager: GameManager

describe('When initialising a game...', () => {
	gameManager = GameManager.createNew({
		playerName: PLAYER_1,
		playerId: PLAYER_1,
		roomId: ROOM_ID,
		category: CATEGORY,
	})
	const gameState = gameManager.getState()

	it('returns a game in the waiting state', () => {
		expect(gameState.state).toEqual('waiting')
	})

	it('returns a game with the correct basic information', () => {
		expect(gameState.roomId).toEqual(ROOM_ID)
		expect(gameState.category).toEqual(CATEGORY)
		expect(gameState.round).toEqual(1)
		expect(gameState.prevAnswers.length).toBe(0)
	})

	it('returns a game with a valid player', () => {
		expect(gameState.players.length).toBe(1)
		expect(gameState.players[0].name).toEqual(PLAYER_1)
		expect(gameState.players[0].score).toEqual(0)
		expect(gameState.players[0].ready).toBeFalsy()
	})

	it('returns a game with a valid answer', () => {
		const allAnswers = Object.values(answersObject).flat() as Answer[]
		const answerExists = allAnswers.find((answer) => answer == gameState.answer)
		const answerInCategory = answersObject[CATEGORY].find((answer) => answer == gameState.answer)
		expect(gameState.answer).toBeTruthy()
		expect(answerExists).toBeTruthy()
		expect(answerInCategory).toBeTruthy()
	})
})

describe('When in the waiting state...', () => {
	beforeEach(() => {
		gameManager = GameManager.createNew({
			playerName: PLAYER_1,
			playerId: PLAYER_1,
			roomId: ROOM_ID,
			category: CATEGORY,
		})
	})

	it('can add players', () => {
		gameManager.handleAction({
			type: 'player-joined',
			payload: { id: PLAYER_2, name: PLAYER_2 },
		})

		const gameState = gameManager.getState()
		expect(gameState.players.length).toBe(2)
		expect(gameState.players[1].name).toEqual(PLAYER_2)
	})

	it('toggles the ready state of players', () => {
		// Toggle ready ON
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { id: PLAYER_1 },
		})

		let gameState = gameManager.getState()
		const player = gameState.players[0]
		expect(player.ready).toBeTruthy()

		// Toggle ready OFF
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { id: PLAYER_1 },
		})

		gameState = gameManager.getState()
		const updatedPlayer = gameState.players[0]
		expect(updatedPlayer.ready).toBeFalsy()
	})

	it('does not start a game if there are not enough players', () => {
		// Add one more player (total 2)
		gameManager.handleAction({
			type: 'player-joined',
			payload: { id: PLAYER_2, name: PLAYER_2 },
		})

		// Make both players ready
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { id: PLAYER_1 },
		})
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { id: PLAYER_2 },
		})

		const gameState = gameManager.getState()
		expect(gameState.state).toEqual('waiting')
	})

	it('starts a game if there are enough players', () => {
		// Add players until we reach minimum (3)
		for (let i = 1; i < gameManager.getMinPlayers(); i++) {
			gameManager.handleAction({
				type: 'player-joined',
				payload: { id: `player${i + 1}`, name: `player${i + 1}` },
			})
		}

		expect(gameManager.getState().state).toEqual('waiting')

		// Toggle ready for all players
		gameManager.getState().players.forEach((player) => {
			if (!player.ready) {
				gameManager.handleAction({
					type: 'toggle-ready',
					payload: { id: player.id },
				})
			}
		})

		const gameState = gameManager.getState()
		expect(gameState.state).toEqual('playing')

		// Check that all players are unready after game starts
		const allPlayersUnready = gameState.players.every((player) => !player.ready)
		expect(allPlayersUnready).toBeTruthy()

		// Verify exactly one imposter
		const imposterCount = gameState.players.filter((player) => player.imposter).length
		expect(imposterCount).toBe(1)
	})
})

describe('When in the playing state...', () => {
	beforeEach(() => {
		gameManager = new GameManager(createTestGameState('playing'))
	})

	it('moves to the voting state when all players are ready', () => {
		// All players are ready
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { id: PLAYER_1 },
		})
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { id: PLAYER_2 },
		})
		gameManager.handleAction({
			type: 'toggle-ready',
			payload: { id: PLAYER_3 },
		})

		const gameState = gameManager.getState()
		expect(gameState.state).toEqual('voting')
	})
})

describe('When in the voting state...', () => {
	beforeEach(() => {
		gameManager = new GameManager(createTestGameState('voting'))
	})

	it('handles player voting', () => {
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_1, vote: PLAYER_2 },
		})

		const gameState = gameManager.getState()
		const votingPlayer = gameState.players.find((player) => player.name === PLAYER_1)
		const votedPlayer = gameState.players.find((player) => player.name === PLAYER_2)
		expect(votingPlayer?.ready).toBeTruthy()
		expect(votedPlayer?.votes).toContain(PLAYER_1)
	})

	it('does not allow a player to vote more than once, and allows players to switch votes', () => {
		// Vote for player 2
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_1, vote: PLAYER_2 },
		})
		// Try to vote again for player 2
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_1, vote: PLAYER_2 },
		})

		let gameState = gameManager.getState()
		const votedPlayer = gameState.players.find((player) => player.name === PLAYER_2)!
		expect(votedPlayer.votes.length).toBe(1)

		// Switch vote to player 3
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_1, vote: PLAYER_3 },
		})

		gameState = gameManager.getState()
		const newVotedPlayer = gameState.players.find((player) => player.name === PLAYER_3)!
		const previousVotedPlayer = gameState.players.find((player) => player.name === PLAYER_2)!
		expect(newVotedPlayer.votes.length).toBe(1)
		expect(previousVotedPlayer.votes.length).toBe(0)
	})

	it('allows the imposter to guess the word', () => {
		gameManager.handleAction({
			type: 'player-guessed',
			payload: { id: PLAYER_2, guess: TEST_ANSWER },
		})

		const gameState = gameManager.getState()
		const imposter = gameState.players.find((player) => player.name === PLAYER_2)!
		expect(imposter.guess).toBe(TEST_ANSWER)
	})

	it('does not set the imposter to ready until they have both voted and guessed', () => {
		// Imposter guesses
		gameManager.handleAction({
			type: 'player-guessed',
			payload: { id: PLAYER_2, guess: TEST_ANSWER },
		})

		let gameState = gameManager.getState()
		const imposter = gameState.players.find((player) => player.name === PLAYER_2)!
		expect(imposter.ready).toBeFalsy()

		// Imposter votes
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_2, vote: PLAYER_1 },
		})

		gameState = gameManager.getState()
		const updatedImposter = gameState.players.find((player) => player.name === PLAYER_2)!
		expect(updatedImposter.ready).toBeTruthy()
	})

	it('does not allow non-imposters to guess the word', () => {
		gameManager.handleAction({
			type: 'player-guessed',
			payload: { id: PLAYER_1, guess: TEST_ANSWER },
		})

		const gameState = gameManager.getState()
		const nonImposter = gameState.players.find((player) => player.name === PLAYER_1)!
		expect(nonImposter.guess).toBe(null)
	})

	it('moves to the results state when all players have voted and guessed', () => {
		// Non-imposters vote
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_1, vote: PLAYER_2 },
		})
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_3, vote: PLAYER_2 },
		})

		// Imposter votes and guesses
		gameManager.handleAction({
			type: 'player-voted',
			payload: { id: PLAYER_2, vote: PLAYER_1 },
		})
		gameManager.handleAction({
			type: 'player-guessed',
			payload: { id: PLAYER_2, guess: TEST_ANSWER },
		})

		const gameState = gameManager.getState()
		expect(gameState.state).toEqual('results')
	})
})

describe('When starting a new round...', () => {
	beforeEach(() => {
		const initialState = createTestGameState('results')
		initialState.players[0].score = 1
		initialState.players[1].score = 3
		initialState.players[2].score = 0
		gameManager = new GameManager(initialState)
	})

	it('starts a new round with a new answer', () => {
		gameManager.getState().players.forEach((player) => {
			gameManager.handleAction({
				type: 'toggle-ready',
				payload: { id: player.name },
			})
		})

		const gameState = gameManager.getState()
		expect(gameState.round).toBe(2)
		expect(gameState.state).toBe('playing')
		expect(gameState.prevAnswers).toContain(TEST_ANSWER)

		// Scores should persist
		const [player1, player2, player3] = gameState.players
		expect(player1.score).toBe(1)
		expect(player2.score).toBe(3)
		expect(player3.score).toBe(0)
	})
})
const createTestGameState = (state: 'playing' | 'voting' | 'results'): GameInfo => ({
	state,
	roomId: ROOM_ID,
	round: 1,
	answer: TEST_ANSWER,
	players: [
		{
			name: PLAYER_1,
			id: PLAYER_1,
			guess: null,
			score: 0,
			ready: false,
			avatarColor: avatarColors[0],
			imposter: false,
			votes: [],
		},
		{
			name: PLAYER_2,
			id: PLAYER_2,
			guess: null,
			score: 0,
			ready: false,
			avatarColor: avatarColors[1],
			imposter: true,
			votes: [],
		},
		{
			name: PLAYER_3,
			id: PLAYER_3,
			guess: null,
			score: 0,
			ready: false,
			avatarColor: avatarColors[2],
			imposter: false,
			votes: [],
		},
	],
	prevAnswers: [],
	category: CATEGORY,
})
