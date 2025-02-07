import { filmAnswers, GameInfo, Player } from '../../../game-logic/types'
import { useGameState } from '../hooks/useGameState'
import { Button } from './Button'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'

const PlayingScreen = ({ self }: { self: string }) => {
	const { gameState } = useGameState() as { gameState: GameInfo }
	const player = gameState.players.find((player) => player.name === self)!
	console.log(player)
	return (
		<div className="flex flex-col gap-5 p-1 items-center w-full mt-1">
			<AnswerBox player={player} />
			<ReadyToVoteBox player={player} />
			<div className="flex flex-col gap-5 w-full"></div>
		</div>
	)
}
function ReadyToVoteBox({ player }: { player: Player }) {
	const { dispatch } = useGameState()

	function toggleReady() {
		dispatch({ type: 'toggle-ready', payload: { name: player.name } })
	}
	return (
		<div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center gap-5 w-full">
			<Presence />
			<h2 className="text-xl font-bold mb-4 text-center">Ready to Vote?</h2>
			<Button onClick={toggleReady} variant={player.ready ? 'disabled' : 'primary'}>
				{player.ready ? '...' : 'Ready'}
			</Button>
		</div>
	)
}

export function Presence() {
	const { gameState } = useGameState() as { gameState: GameInfo }

	return (
		<div className="flex self-start w-full overflow-hidden">
			{gameState.players
				.sort((a, b) => {
					if (a.ready && !b.ready) return -1
					if (!a.ready && b.ready) return 1
					return 0
				})
				.map((player, i) => (
					<div
						style={{ transform: `translateX(-${i * 12}px)`, zIndex: gameState.players.length - i }}
						key={player.name}
						className="flex items-center gap-2"
					>
						<PlayerInitialsIcon showReady player={player} />
					</div>
				))}
		</div>
	)
}
function AnswerBox({ player }: { player: Player }) {
	const { gameState } = useGameState() as { gameState: GameInfo }

	return (
		<div className="bg-white rounded-lg shadow-md p-4 w-full">
			<GameInfoPanel />
			<div className="grid grid-cols-4 gap-2 text-xs w-full">
				{filmAnswers.map((answer) => (
					<div
						className={`border border-gray-100 shadow-sm rounded-lg
					   flex justify-center items-center p-4 
					   aspect-[2/1] text-center leading-none text-nowrap ${answer === gameState.answer && !player.imposter ? 'bg-green-100' : 'bg-slate-50'}`}
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
		<div className="flex flex-col p-4 font-medium text-sm text-gray-800">
			<p>Category: {gameState.category}</p>
		</div>
	)
}

export default PlayingScreen
