import usePartySocket from 'partysocket/react'
import { createContext, useCallback, useContext, useState } from 'react'
import { Action, avatarColors, GameInfo, GameState, Player } from '../../../game-logic/types'
import { Category } from '../components/NewGameForm'
import { PARTYKIT_HOST } from '../env'

interface GameContext {
	gameState: GameState
	dispatch: (action: Action) => void
}
const gameContext = createContext<GameContext>({
	gameState: { state: 'loading' },
	dispatch: () => {},
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
	const votingGame: GameInfo = {
		state: 'voting',
		roomId,
		round: 1,
		answer: 'Titanic',
		players: [
			{
				name: 'player1Name',
				guess: null,
				score: 0,
				ready: false,
				avatarColor: avatarColors[0],
				imposter: false,
				votes: [],
			},
			{
				name: 'Terry',
				guess: null,
				score: 0,
				ready: true,
				avatarColor: avatarColors[1],
				imposter: true,
				votes: [],
			},
			{
				name: 'Jospeh',
				guess: null,
				score: 0,
				ready: false,
				avatarColor: avatarColors[2],
				imposter: false,
				votes: ['Terry'],
			},
		],
		prevAnswers: [],
		category: 'films',
	}
	const [gameState, setGameState] = useState<GameState>(votingGame)

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: roomId,
		id: playerName || 'PLAYER',
		onMessage(event) {
			const message = JSON.parse(event.data) as GameInfo
			if (message) {
				console.log('message', message)
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

	return <gameContext.Provider value={{ gameState, dispatch }}>{children}</gameContext.Provider>
}

export function getPlayer(players: Player[], name: string) {
	return players.find((player) => player.name === name)
}
export function useGameState(): GameContext {
	const context = useContext(gameContext)
	if (context === undefined) {
		throw new Error('useGameState must be used within the GameProvider')
	}
	return context
}
