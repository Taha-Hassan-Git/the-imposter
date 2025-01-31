'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { GameProvider, useGameState } from '../hooks/useGameState'
import { Category } from './NewGameForm'
import PlayingScreen from './PlayingScreen'
import { ResultsScreen } from './ResultsScreen'
import { VotingScreen } from './VotingScreen'
import { WaitingScreen } from './WaitingScreen'

const ROUTE = '/game/'
export default function GameContainer() {
	const path = usePathname()
	const searchParams = useSearchParams()
	const playerName = searchParams.get('playerName')
	const category = searchParams.get('category')

	const roomId = path.slice(ROUTE.length)

	return (
		<div className="flex flex-col w-full items-center">
			<GameProvider playerName={playerName} category={category as Category} roomId={roomId}>
				<Game playerName={playerName} />
			</GameProvider>
		</div>
	)
}

function Game({ playerName }: { playerName: string | null }) {
	const { gameState } = useGameState()
	return (
		<>
			{gameState.state === 'error' ? (
				<ErrorScreen />
			) : gameState.state === 'waiting' ? (
				<WaitingScreen self={playerName as string} />
			) : gameState.state === 'playing' ? (
				<PlayingScreen self={playerName as string} />
			) : gameState.state === 'voting' ? (
				<VotingScreen playerName={playerName as string} />
			) : (
				<ResultsScreen playerName={playerName as string} />
			)}
		</>
	)
}

function ErrorScreen() {
	return <div>Error Screen</div>
}
