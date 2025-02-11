import { Player } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'
import { Panel } from './Panel'

export function ResultsScreen() {
	return (
		<div className="flex flex-col gap-5 p-5 items-center w-full">
			<MessagePanel />
			<ScorePanel />
			<ResultsPanel />
			<NextRoundButton />
		</div>
	)
}

function MessagePanel() {
	const localPlayer = useLocalPlayer()
	const { gameState } = useActiveGame()
	if (!gameState.message) return null
	const { avoidedDetection, guessedCorrectly } = gameState.message
	const imposterName = gameState.players.find((player) => player.imposter)?.name
	const isImposter = localPlayer.imposter
	return (
		<>
			{isImposter ? (
				avoidedDetection ? (
					<Panel className="bg-green-50 border border-green-200">You evaded detection!</Panel>
				) : guessedCorrectly ? (
					<Panel className="bg-green-50 border border-green-200">
						You were caught, but guessed the answer!
					</Panel>
				) : (
					<Panel className="bg-red-50 border border-red-200">You were caught!</Panel>
				)
			) : avoidedDetection ? (
				<Panel className="bg-red-50 border border-red-200">The imposter was {imposterName}</Panel>
			) : guessedCorrectly ? (
				<Panel className="bg-red-50 border border-red-200">
					You got the imposter, but gave away the answer!
				</Panel>
			) : (
				<Panel className="bg-green-50 border border-green-200">You guessed right!</Panel>
			)}{' '}
		</>
	)
}

function ResultsPanel() {
	const { gameState } = useActiveGame()
	const imposter = gameState.players.find((player) => player.imposter)

	return (
		<Panel>
			<h2 className="text-2xl font-bold mb-4 text-center">Results</h2>
			<p className="text-gray-500 text-xl">The imposter was {imposter?.name}</p>
			<ul className="space-y-3"></ul>
		</Panel>
	)
}

function NextRoundButton() {
	const { dispatch } = useActiveGame()
	const localPlayer = useLocalPlayer()
	function handleNextRound() {
		dispatch({ type: 'toggle-ready', payload: { name: localPlayer.name } })
	}

	return (
		<Panel>
			<Button
				className="w-full"
				onClick={handleNextRound}
				variant={localPlayer.ready ? 'disabled' : 'primary'}
			>
				{localPlayer.ready ? '...' : 'Next round'}
			</Button>
		</Panel>
	)
}

function ScorePanel() {
	const { gameState } = useActiveGame()
	console.log(gameState.players)
	return (
		<Panel>
			<h2 className="text-2xl font-bold mb-4 text-center">Scores</h2>
			<p>Round: {gameState.round}</p>
			<ul className="space-y-3">
				{gameState.players
					.sort((a, b) => (a.votes.length > b.votes.length ? -1 : 1))
					.map((player) => (
						<PlayerScoreItem key={player.name} player={player} />
					))}
			</ul>
		</Panel>
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
