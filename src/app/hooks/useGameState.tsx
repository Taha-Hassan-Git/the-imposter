import usePartySocket from 'partysocket/react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Action, GameInfo, GameState, Player } from '../../../game-logic/types'
import { PARTYKIT_HOST } from '../env'

interface GameContext {
	gameState: GameState
	dispatch: (action: Action) => void
	localPlayer: Player | null
}
const gameContext = createContext<GameContext>({
	gameState: { state: 'loading' },
	dispatch: () => {},
	localPlayer: null,
})
export function GameProvider({
	children,
	playerId,
	roomId,
}: {
	children: React.ReactNode
	playerId: string
roomId: string
}) {
	const [gameState, setGameState] = useState<GameState>({ state: 'loading' })

	const localPlayer = useMemo(() => {
		if (gameState.state === 'loading') return null
		return gameState.players.find((player) => player.id === playerId) ?? null
	}, [gameState, playerId])
	console.log('playerid:', playerId)
	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: roomId,
		id: playerId,
		onMessage(event) {
			const message = JSON.parse(event.data) as GameInfo
			if (message) {
				console.log('received message', message)
				setGameState(message)
			}
		},
	})

	// memoise this function
	const dispatch = useCallback(
		(action: Action) => {
			console.log('sending action', action)
			socket.send(JSON.stringify(action))
		},
		[socket]
	)

	return (
		<gameContext.Provider value={{ gameState, dispatch, localPlayer }}>
			{children}
		</gameContext.Provider>
	)
}

export function useGameState(): GameState {
	const { gameState } = useContext(gameContext)
	if (!gameState) {
		throw new Error('useGameState must be used within the GameProvider')
	}
	return gameState
}

export function useActiveGame() {
	const { gameState, dispatch } = useContext(gameContext)
	if (gameState.state === 'loading') {
		throw new Error('Game is still loading')
	}
	return { gameState, dispatch }
}

export function useLocalPlayer() {
	const { localPlayer } = useContext(gameContext)
	if (!localPlayer) {
		throw new Error('Self is not defined')
	}
	return localPlayer
}
