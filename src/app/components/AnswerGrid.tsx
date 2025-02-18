import { Answer, answersObject } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'

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
