import type * as Party from 'partykit/server'
import { GameManager } from '../game-logic/GameManager'
import { Action, Category, GameInfo } from '../game-logic/types'

export interface GameFormInfo {
	playerName: string
	playerId: string
	roomId: string
	category: Category
}

export default class Server implements Party.Server {
	constructor(readonly party: Party.Room) {}

	gameManager: GameManager | undefined

	async onRequest(req: Party.Request) {
		const formInfo = (await req.json()) as GameFormInfo
		try {
			if (!this.gameManager) {
				// setting up a new game
				this.gameManager = GameManager.createNew(formInfo)
				await this.saveGame()
			} else {
				// new player joining an existing game
				this.gameManager.handleAction({
					type: 'player-joined',
					payload: {
						name: formInfo.playerName,
						id: formInfo.playerId,
					},
				})
				await this.saveGame()
				this.party.broadcast(JSON.stringify(this.gameManager.getState()))
			}
			return new Response(JSON.stringify(this.gameManager.getState()), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		} catch {
			return new Response('Error creating game', { status: 500 })
		}
	}

	async onConnect(connection: Party.Connection) {
		if (!this.gameManager) return
		connection.send(JSON.stringify(this.gameManager.getState()))
	}

	async onMessage(message: string) {
		if (!this.gameManager) return

		const action = JSON.parse(message) as Action
		this.gameManager.handleAction(action)
		this.party.broadcast(JSON.stringify(this.gameManager.getState()))
	}

	async saveGame() {
		if (this.gameManager) {
			await this.party.storage.put<GameInfo>('game', this.gameManager.getState())
		}
	}

	async onStart() {
		const savedGame = await this.party.storage.get<GameInfo>('game')
		if (savedGame) {
			this.gameManager = new GameManager(savedGame)
		}
	}
}

Server satisfies Party.Worker
