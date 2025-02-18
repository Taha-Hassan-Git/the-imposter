import { Answer, answersObject } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'
import { Category } from './NewGameForm'
import { Panel } from './Panel'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'

const PlayingScreen = () => {
	return (
		<>
			<AnswerBox />
			<Hint />
			<ReadyToVoteBox />
			<div className="flex flex-col gap-5 w-full"></div>
		</>
	)
}

function Hint() {
	const { gameState } = useActiveGame()
	const firstPlayer = gameState.players[gameState.round % gameState.players.length]

	const hintsObject: Record<Category, string> = {
		films: 'Was this movie released before 2000?',
		animals: 'Are you afraid of this animal?',
		countries: 'Has this country been in the news lately?',
		sports: 'Is this a team sport?',
	}

	return (
		<Panel className="w-full !p-0">
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-3 p-2 pb-4 border-b bg-blue-50 rounded-t-lg">
					<PlayerInitialsIcon className="!h-6 !w-6" player={firstPlayer} />
					<span className="text-md">{firstPlayer.name} goes first!</span>
				</div>
				<div className="pb-4 px-4">
					<div className="text-sm text-gray-600">
						<p>Take turns choosing another player to ask them a question about the secret word.</p>
						<p className="mt-2 text-gray-500 italic">e.g. {hintsObject[gameState.category]}</p>
					</div>
				</div>
			</div>
		</Panel>
	)
}
function ReadyToVoteBox() {
	const { dispatch } = useActiveGame()
	const localPlayer = useLocalPlayer()

	function toggleReady() {
		dispatch({ type: 'toggle-ready', payload: { name: localPlayer.name } })
	}
	return (
		<Panel className="!p-0 sticky bottom-0 border-t">
			<div className="p-4">
				<div className="w-full border-b">
					<Button
						className="w-full"
						onClick={toggleReady}
						variant={localPlayer.ready ? 'disabled' : 'primary'}
					>
						{localPlayer.ready ? '...' : 'Ready to vote?'}
					</Button>
				</div>
			</div>
			<span className="flex w-full items-center justify-center gap-4 mt-2 px-9 py-4 bg-gray-100 border rounded-b-lg">
				<p className="text-nowrap text-sm text-gray-500">Players ready:</p>
				<Presence />
			</span>
		</Panel>
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
	const localPlayer = useLocalPlayer()

	return (
		<Panel variant="column">
			{localPlayer.imposter && (
				<span className="font-bold text-2xl text-red-600">You are the imposter</span>
			)}
			<AnswerGrid />
		</Panel>
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

export default PlayingScreen
