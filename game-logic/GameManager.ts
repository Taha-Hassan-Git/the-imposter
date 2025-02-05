import { GameFormInfo } from '../party'
import { Category } from '../src/app/components/NewGameForm'
import {
	Action,
	Answer,
	answersObject,
	AvatarColor,
	avatarColors,
	GameInfo,
	Player,
	StateNames,
} from './types'

export class GameManager {
	private static readonly MIN_PLAYERS = 3
	private game: GameInfo
	private readonly STATE_TRANSITIONS: Record<StateNames, StateNames> = {
		waiting: 'playing',
		playing: 'voting',
		voting: 'results',
		results: 'playing',
	} as const

	constructor(gameInfo?: GameInfo) {
		if (gameInfo) {
			this.game = gameInfo
		} else {
			throw new Error('Game info is required to initialize GameManager')
		}
	}

	static createNew(formInfo: GameFormInfo): GameManager {
		const avatarColor = GameManager.assignUnusedAvatarColor()
		const answer = GameManager.getUnusedAnswer(formInfo.category)

		const initialGame: GameInfo = {
			state: 'waiting',
			roomId: formInfo.roomId,
			round: 1,
			answer,
			players: [
				{
					name: formInfo.playerName,
					score: 0,
					ready: false,
					avatarColor,
					imposter: false,
					votes: [],
				},
			],
			prevAnswers: [],
			category: formInfo.category,
		}

		return new GameManager(initialGame)
	}

	getState(): GameInfo {
		return this.game
	}

	getMinPlayers(): number {
		return GameManager.MIN_PLAYERS
	}

	handleAction(action: Action): void {
		switch (action.type) {
			case 'player-joined': {
				this.handlePlayerJoined(action.payload.name)
				break
			}
			case 'player-left': {
				this.handlePlayerLeft(action.payload.name)
				break
			}
			case 'toggle-ready': {
				this.handleToggleReady(action.payload.name)
				break
			}
			case 'player-voted': {
				this.handlePlayerVoted(action.payload.name, action.payload.vote)
				break
			}
		}
	}

	private handlePlayerVoted(playerName: string, vote: string): void {
		const player = this.game.players.find((player) => player.name === playerName)
		const votedForPlayer = this.game.players.find((player) => player.name === vote)
		if (!player || !votedForPlayer || player.name === vote) return

		// if player has already voted for someone else, remove that vote
		let newPlayers = this.game.players.map((player) => {
			if (player.votes.includes(playerName)) {
				player.votes = player.votes.filter((voter) => voter !== playerName)
			}
			return player
		})
		// add vote to player
		newPlayers = newPlayers
			.map((player) => (player.name === playerName ? { ...player, ready: true } : player))
			.map((player) =>
				player.name === vote ? { ...player, votes: [...player.votes, playerName] } : player
			)

		this.game = { ...this.game, players: newPlayers }
		this.tryAdvanceGameState()
	}

	private handlePlayerJoined(playerName: string): void {
		const playerExists = this.game.players.some((player) => player.name === playerName)
		const isWaiting = this.game.state === 'waiting'

		if (playerExists || !isWaiting) {
			return
		}

		const newPlayer: Player = {
			name: playerName,
			score: 0,
			ready: false,
			avatarColor: GameManager.assignUnusedAvatarColor(this.game),
			imposter: false,
			votes: [],
		}

		const newPlayers = [...this.game.players, newPlayer]

		this.game = { ...this.game, players: newPlayers }
	}

	private handlePlayerLeft(playerName: string): void {
		const updatedPlayers = this.game.players.filter((player) => player.name !== playerName)

		if (updatedPlayers.length < GameManager.MIN_PLAYERS) {
			this.game = {
				...this.game,
				state: 'waiting',
				players: updatedPlayers.map((player) => ({
					...player,
					ready: false,
				})),
			}
			return
		}
		this.game = { ...this.game, players: updatedPlayers }
	}

	private handleToggleReady(playerName: string): void {
		const newPlayers = this.game.players.map((player) =>
			player.name === playerName ? { ...player, ready: !player.ready } : player
		)
		this.game = { ...this.game, players: newPlayers }
		this.tryAdvanceGameState()
	}

	private tryAdvanceGameState(): void {
		const moreThanMinimum = this.game.players.length >= GameManager.MIN_PLAYERS
		const allPlayersReady = this.game.players.every((player) => player.ready)

		if (moreThanMinimum && allPlayersReady) {
			if (this.game.state === 'waiting') {
				this.assignImposter()
			}
			this.advanceToNextState()
			this.resetAllPlayers()
		}
	}

	private advanceToNextState(): void {
		const prevState = this.game.state
		const nextState = this.STATE_TRANSITIONS[prevState]
		this.game = { ...this.game, state: nextState }
		if (nextState === 'results') {
			this.awardPoints()
		}
		if (this.isNewRound(prevState, nextState)) {
			this.startNewRound()
		}
	}
	private isNewRound(prevState: StateNames, nextState: StateNames): boolean {
		return prevState === 'results' && nextState === 'playing'
	}

	private startNewRound(): void {
		this.game = {
			...this.game,
			prevAnswers: [...this.game.prevAnswers, this.game.answer],
			answer: GameManager.getUnusedAnswer(this.game.category, this.game),
			round: this.game.round + 1,
		}
	}
	private awardPoints(): void {
		const imposter = this.game.players.find((player) => player.imposter)
		const mostVotedPlayer = this.game.players.reduce((acc, player) =>
			player.votes.length > acc.votes.length ? player : acc
		)

		if (!imposter) return

		// award points to players that guessed the imposter correctly
		let newPlayers = this.game.players.map((player) => {
			if (imposter.votes.includes(player.name)) {
				return { ...player, score: player.score + 1 }
			}
			return player
		})

		// award points to the imposter for evading detection
		if (mostVotedPlayer.name !== imposter.name) {
			newPlayers = newPlayers.map((player) => {
				if (player.name === imposter.name) {
					return { ...player, score: player.score + 3 }
				}
				return player
			})
		}
		this.game = { ...this.game, players: newPlayers }
	}

	private assignImposter(): void {
		const randomIndex = Math.floor(Math.random() * this.game.players.length)
		const newPlayers = this.game.players.map((player, index) => ({
			...player,
			imposter: index === randomIndex,
		}))
		this.game = { ...this.game, players: newPlayers }
	}

	private resetAllPlayers(): void {
		const newPlayers = this.game.players.map((player) => ({
			...player,
			ready: false,
			votes: [],
		}))
		this.game = { ...this.game, players: newPlayers }
	}

	private static assignUnusedAvatarColor(game?: GameInfo): AvatarColor {
		if (!game) {
			return avatarColors[Math.floor(Math.random() * avatarColors.length)]
		}

		const usedColors = game.players.map((player) => player.avatarColor)
		const availableColors = avatarColors.filter((color) => !usedColors.includes(color))

		return availableColors[Math.floor(Math.random() * availableColors.length)]
	}

	private static getUnusedAnswer(category: Category, game?: GameInfo): Answer {
		const array = answersObject[category]

		if (!game) {
			return array[Math.floor(Math.random() * array.length)]
		}

		const availableAnswers = array.filter((answer) => !game.prevAnswers.includes(answer))

		return availableAnswers[Math.floor(Math.random() * availableAnswers.length)]
	}
}
