import usePartySocket from 'partysocket/react'
import { createContext, useCallback, useContext, useState } from 'react'
import { Action, GameInfo, GameState, Player } from '../../../game-logic/types'
import { Category } from '../components/NewGameForm'
import { PARTYKIT_HOST } from '../env'
import { generatePlayerName } from '../utils/generatePlayerName'

interface GameContext {
	gameState: GameState
	dispatch: (action: Action) => void
}
const gameContext = createContext<GameContext>({
	gameState: { state: 'error' },
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
	const player2Name = 'test2'
	const testPlayer = 'test'
	const resultsGame: GameInfo = {
		state: 'results',
		roomId,
		round: 1,
		answer: 'Titanic',
		players: [
			{
				name: testPlayer,
				score: 0,
				ready: false,
				avatarColor: 'red',
				imposter: false,
				votes: [player2Name],
			},
			{
				name: player2Name,
				score: 0,
				ready: false,
				avatarColor: 'blue',
				imposter: true,
				votes: [testPlayer],
			},
			{
				name: 'test3',
				score: 0,
				ready: false,
				avatarColor: 'green',
				imposter: false,
				votes: [testPlayer],
			},
		],
		prevAnswers: [],
		category: 'films',
	}
	const [gameState, setGameState] = useState<GameState>(resultsGame)

	const socket = usePartySocket({
		host: PARTYKIT_HOST,
		room: roomId,
		id: playerName || generatePlayerName(),
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
