import usePartySocket from 'partysocket/react'
import { createContext, useCallback, useContext, useState } from 'react'
import { Action, avatarColors, GameInfo, GameState, Player } from '../../../game-logic/types'
import { Category } from '../components/NewGameForm'
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
	playerName,
	roomId,
}: {
	children: React.ReactNode
	playerName: string | null
	category: Category | null
	roomId: string
}) {
	const resultsGame: GameInfo = {
		state: 'results',
		roomId: 'test',
		round: 1,
		answer: 'Titanic',
		players: [
			{
				name: 'test',
				guess: null,
				score: 1,
				ready: false,
				avatarColor: avatarColors[0],
				imposter: false,
				votes: [],
			},
			{
				name: 'test2',
				guess: null,
				score: 3,
				ready: false,
				avatarColor: avatarColors[1],
				imposter: true,
				votes: [],
			},
			{
				name: 'test3',
				guess: null,
				score: 0,
				ready: false,
				avatarColor: avatarColors[2],
				imposter: false,
				votes: [],
			},
		],
		prevAnswers: [],
		category: 'films',
	}
	const [gameState, setGameState] = useState<GameState>(resultsGame)
	const [localPlayer, setLocalPlayer] = useState<Player | null>({
		name: 'test',
		guess: null,
		score: 1,
		ready: false,
		avatarColor: avatarColors[0],
		imposter: false,
		votes: [],
	})

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: roomId,
		id: playerName || 'PLAYER',
		onMessage(event) {
			const message = JSON.parse(event.data) as GameInfo
			if (message) {
				setGameState(message)
				setLocalPlayer(getPlayer(playerName!, message))
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
