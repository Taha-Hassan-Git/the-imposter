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
		// if the player is archived, they are rejoining the game
		const hasArchivedPlayers = this.gameManager.getState().archivedPlayers.length > 0
		if (hasArchivedPlayers) {
			console.log('player rejoining', connection.id)
			console.log({
				connectionId: connection.id,
				archivedPlayers: this.gameManager.getState().archivedPlayers,
			})
			const player = this.gameManager.getState().archivedPlayers.find((p) => p.id === connection.id)
			if (player) {
				this.gameManager.handleAction({
					type: 'player-joined',
					payload: { id: player.id, name: player.name },
				})
			}
		}

		this.party.broadcast(JSON.stringify(this.gameManager.getState()))
	}

	async onClose(connection: Party.Connection) {
		console.log('player left', connection.id)
		if (!this.gameManager) return
		// wait for 5 minutes then check if player rejoined
		const timeout = 1000
		setTimeout(() => {
			const connectionsArray = []
			for (const c of this.party.getConnections()) {
				connectionsArray.push(c.id)
			}
			const leftGame = !connectionsArray.includes(connection.id)
			if (leftGame) {
				this.gameManager?.handleAction({
					type: 'player-left',
					payload: { id: connection.id },
				})
				this.party.broadcast(JSON.stringify(this.gameManager?.getState()))
			}
		}, timeout)
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
