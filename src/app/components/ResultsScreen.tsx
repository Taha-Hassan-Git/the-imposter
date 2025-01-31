import { Action, GameInfo } from '../../../game-logic/types'
import { useGameState } from '../hooks/useGameState'
import { Button } from './Button'
import { ScorePanel } from './PlayingScreen'

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
	const players = gameState.players
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
