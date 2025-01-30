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
		}
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
			this.assignImposter()
			this.setAllPlayersUnready()
			this.advanceToNextState()
		}
	}

	private advanceToNextState(): void {
		const currentStateIndex = gameStatesInSequence.indexOf(this.game.state)
		this.game.state = gameStatesInSequence[currentStateIndex + 1]
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
