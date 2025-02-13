'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { GameProvider, useGameState } from '../hooks/useGameState'
import { Category } from './NewGameForm'
import { Pill } from './Pill'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'
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
				<InfoBar />
				<Game />
			</GameProvider>
		</div>
	)
}
function InfoBar() {
	const gameState = useGameState()
	if (gameState.state === 'loading') return null
	return (
		<div className="bg-gray-100 border border-gray-100 w-screen">
			<div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-10 text-sm">
					<div className="flex items-center space-x-4">
						<span className="flex items-center">
							<div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
							<span className="text-gray-600">Room: </span>
							<Pill>{gameState.roomId}</Pill>
						</span>
						<span className="text-gray-300">|</span>
						<span className="flex items-center gap-1">
							<span className="text-gray-600">Players: </span>
							<span className="flex">
								{gameState.players
									.sort((a, b) => {
										if (a.score > b.score) return -1
										if (a.score < b.score) return 1
										else return 0
									})
									.map((player, i) => (
										<span
											style={{
												zIndex: gameState.players.length - i,
												transform: `translateX(-${i * 8}px)`,
											}}
											key={player.name + 'initalsicon'}
										>
											<PlayerInitialsIcon
												className="!h-5 !w-5 teat-[4px] border border-gray-100"
												player={player}
											/>
										</span>
									))}
							</span>
						</span>
					</div>
					<Pill>
						<span className="text-gray-600">Round:</span>
						<span className="font-medium text-gray-900">{gameState.round}</span>
					</Pill>
				</div>
			</div>
		</div>
	)
}
function Game() {
	const gameState = useGameState()
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
