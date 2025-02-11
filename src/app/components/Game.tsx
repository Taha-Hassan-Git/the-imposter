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
	const roomId = path.slice(ROUTE.length)
	const searchParams = useSearchParams()
	const playerName = searchParams.get('playerName')
	const category = searchParams.get('category')

	return (
		<div className="flex flex-col w-full items-center">
			<GameProvider playerName={playerName} category={category as Category} roomId={roomId}>
				<Game />
			</GameProvider>
		</div>
	)
}

function Game() {
	const { gameState } = useGameState()
	return (
		<>
			{gameState.state === 'loading' ? (
				<LoadingScreen />
			) : gameState.state === 'waiting' ? (
				<WaitingScreen />
			) : gameState.state === 'playing' ? (
				<PlayingScreen />
			) : gameState.state === 'voting' ? (
				<VotingScreen />
			) : (
				<ResultsScreen />
			)}
		</>
	)
}

export function LoadingScreen() {
	return <div>Loading... </div>
}
