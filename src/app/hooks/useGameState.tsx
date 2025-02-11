import usePartySocket from 'partysocket/react'
import { createContext, useCallback, useContext, useState } from 'react'
import { Action, GameInfo, GameState, Player } from '../../../game-logic/types'
import { Category } from '../components/NewGameForm'
import { PARTYKIT_HOST } from '../env'

interface GameContext {
	gameState: GameState
	dispatch: (action: Action) => void
	self: Player | null
}
const gameContext = createContext<GameContext>({
	gameState: { state: 'loading' },
	dispatch: () => {},
	self: null,
})
export function GameProvider({
	children,
	playerName,
	roomId,
}: {
	children: React.ReactNode
	playerName: string | null
	category: Category | null
	roomId: string
}) {
	const [gameState, setGameState] = useState<GameState>({ state: 'loading' })
	const [self, setSelf] = useState<Player | null>(null)

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: roomId,
		id: playerName || 'PLAYER',
		onMessage(event) {
			const message = JSON.parse(event.data) as GameInfo
			if (message) {
				setGameState(message)
				setSelf(getPlayer(playerName!, message))
			}
		},
	})

	function getPlayer(name: string, game: GameInfo): Player {
		return game.players.find((player) => player.name === name)!
	}

	// memoise this function
	const dispatch = useCallback(
		(action: Action) => {
			console.log('sending action', action)
			socket.send(JSON.stringify(action))
		},
		[socket]
	)

	return (
		<gameContext.Provider value={{ gameState, dispatch, self }}>{children}</gameContext.Provider>
	)
}

export function useGameState(): GameContext {
	const context = useContext(gameContext)
	if (context === undefined) {
		throw new Error('useGameState must be used within the GameProvider')
	}
	return context
}
