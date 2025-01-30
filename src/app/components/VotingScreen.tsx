import { GameInfo, Player } from '../../../game-logic/types'
import { useGameState } from '../hooks/useGameState'
import { Button } from './Button'

export function VotingScreen({ playerName }: { playerName: string }) {
	const { gameState } = useGameState() as { gameState: GameInfo }
	return (
		<div className="flex flex-col gap-5 p-5 items-center">
			<div className="bg-white rounded-lg shadow-md p-8 flex flex-col gap-4 min-w-[360px]">
				<h2 className="text-2xl font-bold mb-4 text-center">Vote</h2>
				<p>Vote for the player you think is the imposter!</p>
				<ul className="space-y-3">
					{gameState.players.map((player: Player) => (
						<PlayerListItem key={player.name} self={playerName} player={player} />
					))}
				</ul>
			</div>
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
				onClick={handleVote}
				variant="secondary"
				className="flex items-center bg-transparent hover:bg-gray-100 w-[80%]"
			>
				<div
					className="w-6 h-6 rounded-full mr-3"
					suppressHydrationWarning
					style={{ backgroundColor: player.avatarColor, opacity: 0.6 }}
				/>
				<span className="font-bold flex-1 text-start">{player.name}</span>
			</Button>
			{player.ready ? (
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
				<span className="text-gray-500 text-sm">...</span>
			)}
		</li>
	)
}
