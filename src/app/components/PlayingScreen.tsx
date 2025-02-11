import { Answer, answersObject } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'

const PlayingScreen = () => {
	return (
		<div className="flex flex-col gap-5 p-1 items-center w-full mt-1">
			<AnswerBox />
			<ReadyToVoteBox />
			<div className="flex flex-col gap-5 w-full"></div>
		</div>
	)
}
function ReadyToVoteBox() {
	const { dispatch } = useActiveGame()
	const localPlayer = useLocalPlayer()

	function toggleReady() {
		dispatch({ type: 'toggle-ready', payload: { name: localPlayer.name } })
	}
	return (
		<div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center gap-5 w-full">
			<Presence />
			<h2 className="text-xl font-bold mb-4 text-center">Ready to Vote?</h2>
			<Button onClick={toggleReady} variant={localPlayer.ready ? 'disabled' : 'primary'}>
				{localPlayer.ready ? '...' : 'Ready'}
			</Button>
		</div>
	)
}

export function Presence() {
	const { gameState } = useActiveGame()

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
function AnswerBox() {
	const { gameState } = useActiveGame()
	const localPlayer = useLocalPlayer()

	return (
		<div className="bg-white rounded-lg shadow-md p-4 w-full">
			<GameInfoPanel />
			<AnswerGrid />
			<div className="mt-6">
				{localPlayer.imposter ? (
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

export function AnswerGrid({
	hasButtons,
	onClick,
}: {
	hasButtons?: boolean
	onClick?: (answer: Answer) => void
}) {
	const { gameState } = useActiveGame()
	const localPlayer = useLocalPlayer()
	return (
		<div className="grid grid-cols-4 gap-2 text-xs w-full">
			{answersObject[gameState.category].map((answer) =>
				hasButtons ? (
					<Button
						key={answer}
						className="text-center"
						onClick={onClick ? () => onClick(answer) : undefined}
						variant={localPlayer.guess === answer ? 'primary' : 'secondary'}
					>
						{answer}
					</Button>
				) : (
					<AnswerItem key={answer} answer={answer} />
				)
			)}
		</div>
	)
}
function AnswerItem({ answer }: { answer: Answer }) {
	const { gameState } = useActiveGame()
	const localPlayer = useLocalPlayer()

	return (
		<div
			className={`border border-gray-100 shadow-sm rounded-lg
		   flex justify-center items-center p-4 
		   aspect-[2/1] text-center leading-none text-nowrap ${answer === gameState.answer && !localPlayer.imposter ? 'bg-green-100' : 'bg-slate-50'}`}
			key={answer}
		>
			<p className="font-medium">{answer}</p>
		</div>
	)
}
function GameInfoPanel() {
	// contains round and category info
	const { gameState } = useActiveGame()
	return (
		<div className="flex flex-col p-4 font-medium text-sm text-gray-800">
			<p>Category: {gameState.category}</p>
		</div>
	)
}

export default PlayingScreen
