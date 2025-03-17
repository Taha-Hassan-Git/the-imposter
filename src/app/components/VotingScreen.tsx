import { Answer, Player } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { AnswerGrid } from './AnswerGrid'
import { Button } from './Button'
import { Panel } from './Panel'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'

export function VotingScreen() {
	return (
		<>
			<ChooseAnswer />
			<VotePanel />
		</>
	)
}

function VotePanel() {
	const { gameState } = useActiveGame()
	const localPlayer = useLocalPlayer()
	return (
		<Panel className="!p-0">
			<div className="p-8">
				<h2 className="text-md font-bold mb-4 text-center">Who is the imposter?</h2>
				<ul data-testid="player-vote-list" className="space-y-4">
					{gameState.players
						.filter((player) => player.id !== localPlayer.id)
						.map((player: Player) => (
							<PlayerVoteItem key={player.name} player={player} />
						))}
				</ul>
			</div>
		</Panel>
	)
}

function ChooseAnswer() {
	const { dispatch } = useActiveGame()
	const localPlayer = useLocalPlayer()

	function handleGuess(answer: Answer) {
		dispatch({ type: 'player-guessed', payload: { id: localPlayer.id, guess: answer } })
	}
	if (!localPlayer.imposter) return null
	return (
		<Panel>
			<h2 className="text-md mb-4 text-start">Choose an answer:</h2>
			<ul className="space-y-4">
				<AnswerGrid hasButtons onClick={handleGuess} />
			</ul>
		</Panel>
	)
}

function PlayerVoteItem({ player }: { player: Player }) {
	const { dispatch } = useActiveGame()
	const localPlayer = useLocalPlayer()
	function handleVote() {
		dispatch({ type: 'player-voted', payload: { id: localPlayer.id, vote: player.id } })
	}

	return (
		<li className="flex items-center justify-between">
			<Button
				disabled={player.votes.includes(localPlayer.name)}
				onClick={handleVote}
				variant="secondary"
				className="flex items-center justify-between align-middle w-full gap-2 bg-gray-50 hover:bg-gray-50 border"
			>
				<div data-testid="player-vote" className="flex items-center gap-4">
					<PlayerInitialsIcon player={player} />
					<span className="font-bold text-start text-nowrap overflow-ellipsis">{player.name}</span>
				</div>
				{player.votes.includes(localPlayer.id) ? (
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
