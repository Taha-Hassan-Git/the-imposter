import { filmAnswers, GameInfo, Player } from '../../../game-logic/types'
import { useGameState } from '../hooks/useGameState'
import { Button } from './Button'

const PlayingScreen = () => {
	const self = 'player2'
	const { gameState } = useGameState() as { gameState: GameInfo }
	const player = gameState.players.find((player) => player.name === self)!
	console.log(player)
	return (
		<div className="flex flex-col gap-5 p-5 items-center w-full">
			<div className="flex flex-col gap-5 justify-between w-full">
				<ScorePanel />
			</div>
			<div className="flex flex-col gap-5 w-full">
				<AnswerBox player={player} />
				<ReadyToVoteBox player={player} />
			</div>
		</div>
	)
}
function ReadyToVoteBox({ player }: { player: Player }) {
	const { dispatch } = useGameState()

	function toggleReady() {
		dispatch({ type: 'toggle-ready', payload: { name: player.name } })
	}
	return (
		<div className="bg-white rounded-lg shadow-md p-8 w-full flex flex-col items-center justify-center gap-5">
			<h2 className="text-xl font-bold mb-4 text-center">Ready to Vote?</h2>
			<Button onClick={toggleReady} variant={player.ready ? 'disabled' : 'primary'}>
				{player.ready ? '...' : 'Ready'}
			</Button>
		</div>
	)
}
function AnswerBox({ player }: { player: Player }) {
	const { gameState } = useGameState() as { gameState: GameInfo }

	return (
		<div className="bg-white rounded-lg shadow-md p-4 w-full text-2xl text-center font-thin text-gray-700">
			<GameInfoPanel />
			<div className="grid grid-cols-4 gap-2 text-sm">
				{filmAnswers.map((answer) => (
					<div
						className={`border border-gray-100 shadow-sm rounded-lg
					   flex justify-center items-center p-3 
					   aspect-[1/1] text-center leading-tight ${answer === gameState.answer && !player.imposter ? 'bg-green-100' : 'bg-slate-50'}`}
						key={answer}
					>
						<p className="font-medium">{answer}</p>
					</div>
				))}
			</div>
			<div className="mt-6">
				{player.imposter ? (
					<span className="font-bold text-2xl text-red-600">You are the imposter</span>
				) : (
					<div className="space-x-2">
						Answer: <span className="font-bold text-2xl text-green-600">{gameState.answer}</span>
					</div>
				)}
			</div>
		</div>
	)
}
function GameInfoPanel() {
	// contains round and category info
	const { gameState } = useGameState() as { gameState: GameInfo }
	return (
		<div
			className="bg-white rounded-lg shadow
        -md p-8"
		>
			<div className="flex flex-col gap-3">
				<p className="text-gray-500 text-xl">Round: {gameState.round}</p>
				<p className="text-gray-500 text-xl">Category: {gameState.category}</p>
			</div>
		</div>
	)
}
export function ScorePanel() {
	const { gameState } = useGameState() as { gameState: GameInfo }
	return (
		<div className="bg-white rounded-lg shadow-md p-8 w-full">
			<h2 className="text-2xl font-bold mb-4 text-center">Scores</h2>
			<ul className="space-y-3">
				{gameState.players.map((player) => (
					<PlayerScoreItem key={player.name} player={player} />
				))}
			</ul>
		</div>
	)
}

export function PlayerScoreItem({ player }: { player: Player }) {
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
export default PlayingScreen
