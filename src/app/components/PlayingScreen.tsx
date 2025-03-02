import { Category } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { AnswerGrid } from './AnswerGrid'
import { Panel } from './Panel'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'
import { ReadyBtnWithPresence } from './ReadyBtnWithPresence'

const PlayingScreen = () => {
	return (
		<>
			<AnswerBox />
			<Hint />
			<ReadyBtnWithPresence text={'Ready to vote?'} />
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
						<p>Take turns asking another player about the secret word.</p>
						<p>Try not to be too obvious, or the imposter will figure it out.</p>
						<p>After two rounds of questions, it&apos;s time to vote!</p>
						<p className="mt-2 text-gray-500 italic">e.g. {hintsObject[gameState.category]}</p>
					</div>
				</div>
			</div>
		</Panel>
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

export default PlayingScreen
