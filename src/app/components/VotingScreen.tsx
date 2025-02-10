import { Action, Answer, GameInfo, Player } from '../../../game-logic/types'
import { useGameState } from '../hooks/useGameState'
import { Button } from './Button'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'
import { AnswerGrid, Presence } from './PlayingScreen'

export function VotingScreen({ self }: { self: string }) {
	const { gameState } = useGameState() as { gameState: GameInfo }

	return (
		<div className="flex flex-col gap-5 p-5 items-center w-full">
			<div className="bg-white rounded-lg shadow-md p-8 flex flex-col gap-4 w-full">
				<h2 className="text-md font-bold mb-4 text-center">Who is the imposter?</h2>
				<ul className="space-y-4">
					{gameState.players
						.filter((player) => player.name !== self)
						.map((player: Player) => (
							<PlayerListItem key={player.name} self={self} player={player} />
						))}
				</ul>
			</div>
			<ChooseAnswer self={self} />
			<div className="w-full bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center gap-5">
				Waiting for all players to vote...
				<Presence />
			</div>
		</div>
	)
}

function ChooseAnswer({ self }: { self: string }) {
	const { gameState, dispatch } = useGameState() as {
		gameState: GameInfo
		dispatch: (a: Action) => void
	}
	const player = gameState.players.find((player) => player.name === self)!
	if (player.imposter === false) {
		return null
	}
	function handleGuess(answer: Answer) {
		dispatch({ type: 'player-guessed', payload: { name: self, guess: answer } })
	}
	return (
		<div className="bg-white rounded-lg shadow-md p-8 flex flex-col gap-4 min-w-[360px]">
			<h2 className="text-md font-bold mb-4 text-center">Choose an answer</h2>
			<ul className="space-y-4">
				<AnswerGrid player={player} hasButtons onClick={handleGuess} />
			</ul>
		</div>
	)
}

function PlayerListItem({ player, self }: { player: Player; self: string }) {
	const { dispatch } = useGameState()

	function handleVote() {
		dispatch({ type: 'player-voted', payload: { name: self, vote: player.name } })
	}

	return (
		<li className="flex items-center justify-between">
			<Button
				disabled={player.votes.includes(self)}
				onClick={handleVote}
				variant="secondary"
				className="flex items-center justify-between align-middle w-full gap-2 bg-gray-50 hover:bg-gray-50 border"
			>
				<div className="flex items-center gap-4">
					<PlayerInitialsIcon player={player} />
					<span className="font-bold text-start text-nowrap overflow-ellipsis">{player.name}</span>
				</div>
				{player.votes.includes(self) ? (
					<span className="text-green-500 text-sm flex items-center">
						<svg
							className="w-4 h-4 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						/>
						voted!
					</span>
				) : (
					<span className="text-gray-500 text-sm">vote</span>
				)}
			</Button>
		</li>
	)
}
