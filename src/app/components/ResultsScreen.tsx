import { Action, GameInfo, Player } from '../../../game-logic/types'
import { useGameState } from '../hooks/useGameState'
import { Button } from './Button'

export function ResultsScreen({ playerName }: { playerName: string }) {
	return (
		<div className="flex flex-col gap-5 p-5 items-center">
			<div className="flex gap-5 justify-between">
				<ScorePanel />
			</div>
			<div className="flex flex-col gap-5">
				<ResultsPanel />
				<NextRoundButton playerName={playerName} />
			</div>
		</div>
	)
}

function ResultsPanel() {
	const { gameState } = useGameState() as { gameState: GameInfo }
	const imposter = gameState.players.find((player) => player.imposter)

	return (
		<div className="bg-white rounded-lg shadow-md p-8 min-w-[360px]">
			<h2 className="text-2xl font-bold mb-4 text-center">Results</h2>
			<p className="text-gray-500 text-xl">The imposter was {imposter?.name}</p>
			<ul className="space-y-3">
				{/* {players.map((player: Player) => (
					<PlayerListItem key={player.name} player={player} />
				))} */}
			</ul>
		</div>
	)
}

function NextRoundButton({ playerName }: { playerName: string }) {
	const { gameState, dispatch } = useGameState() as {
		gameState: GameInfo
		dispatch: (v: Action) => void
	}
	function handleNextRound() {
		dispatch({ type: 'toggle-ready', payload: { name: playerName } })
	}
	const player = gameState.players.find((player) => player.name === playerName)!
	return (
		<div className="bg-white rounded-lg shadow-md p-8 min-w-[360px]">
			<Button onClick={handleNextRound} variant={player.ready ? 'disabled' : 'primary'}>
				{player.ready ? '...' : 'Next round'}
			</Button>
		</div>
	)
}

function ScorePanel() {
	const { gameState } = useGameState() as { gameState: GameInfo }
	return (
		<div className="bg-white rounded-lg shadow-md p-8 flex-1">
			<h2 className="text-2xl font-bold mb-4 text-center">Scores</h2>
			<p>Round: {gameState.round}</p>
			<ul className="space-y-3">
				{gameState.players.map((player) => (
					<PlayerScoreItem key={player.name} player={player} />
				))}
			</ul>
		</div>
	)
}

function PlayerScoreItem({ player }: { player: Player }) {
	// Get player initials
	const initials = player.name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)

	return (
		<li className="group flex items-center justify-between py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
			<div className="flex items-center space-x-4">
				<div
					className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm"
					style={{ backgroundColor: player.avatarColor, opacity: player.ready ? 0.7 : 0.5 }}
				>
					{initials}
				</div>
				<span className="font-semibold text-gray-900">{player.name}</span>
			</div>
			<span className="text-2xl font-bold text-gray-700 tabular-nums">{player.score}</span>
		</li>
	)
}
