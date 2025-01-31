import { GameFormInfo } from '../party'
import { Category } from '../src/app/components/NewGameForm'
import {
	Action,
	Answer,
	answersObject,
	AvatarColor,
	avatarColors,
	GameInfo,
	gameStatesInSequence,
	Player,
} from './types'

export class GameManager {
	private static readonly MIN_PLAYERS = 3
	private game: GameInfo

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
		this.game.players = this.game.players.map((player) => {
			if (player.votes.includes(playerName)) {
				player.votes = player.votes.filter((voter) => voter !== playerName)
			}
			return player
		})
		// add vote to player
		this.game.players = this.game.players
			.map((player) => (player.name === playerName ? { ...player, ready: true } : player))
			.map((player) =>
				player.name === vote ? { ...player, votes: [...player.votes, playerName] } : player
			)

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

		this.game.players = [...this.game.players, newPlayer]
	}

	private handlePlayerLeft(playerName: string): void {
		const updatedPlayers = this.game.players.filter((player) => player.name !== playerName)

		if (updatedPlayers.length < GameManager.MIN_PLAYERS) {
			this.game.state = 'waiting'
			this.game.players = updatedPlayers.map((player) => ({
				...player,
				ready: false,
			}))
			return
		}

		this.game.players = updatedPlayers
	}

	private handleToggleReady(playerName: string): void {
		this.game.players = this.game.players.map((player) =>
			player.name === playerName ? { ...player, ready: !player.ready } : player
		)

		this.tryAdvanceGameState()
	}

	private tryAdvanceGameState(): void {
		const moreThanMinimum = this.game.players.length >= GameManager.MIN_PLAYERS
		const allPlayersReady = this.game.players.every((player) => player.ready)

		if (moreThanMinimum && allPlayersReady) {
			if (this.game.state === 'waiting') {
				this.assignImposter()
			}
			this.setAllPlayersUnready()
			this.advanceToNextState()
		}
	}

	private advanceToNextState(): void {
		const currentStateIndex = gameStatesInSequence.indexOf(this.game.state)
		const nextState = gameStatesInSequence[currentStateIndex + 1]
		this.game.state = nextState
		if (nextState === 'results') {
			this.awardPoints()
			this.game.prevAnswers = [...this.game.prevAnswers, this.game.answer]
			this.game.answer = GameManager.getUnusedAnswer(this.game.category, this.game)
		}
	}
	private awardPoints(): void {
		const imposter = this.game.players.find((player) => player.imposter)

		if (!imposter) return

		imposter.votes.forEach((voter) => {
			const player = this.game.players.find((player) => player.name === voter)
			if (player) {
				player.score += 1
			}
		})

		const mostVotedPlayer = this.game.players.reduce((acc, player) =>
			player.votes.length > acc.votes.length ? player : acc
		)
		if (mostVotedPlayer.name !== imposter.name) {
			imposter.score += 3
		}
	}

	private assignImposter(): void {
		const randomIndex = Math.floor(Math.random() * this.game.players.length)
		this.game.players = this.game.players.map((player, index) => ({
			...player,
			imposter: index === randomIndex,
		}))
	}

	private setAllPlayersUnready(): void {
		this.game.players = this.game.players.map((player) => ({
			...player,
			ready: false,
		}))
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
