import { useState } from 'react'
import { Action, GameInfo, Player } from '../../../game-logic/types'
import { useGameState } from '../hooks/useGameState'
import { Button } from './Button'

export function WaitingScreen({ self }: { self: string }) {
	const { gameState } = useGameState() as { gameState: GameInfo }
	return (
		<div className="flex flex-col gap-5 p-5 items-center">
			<div className="bg-white rounded-lg shadow-md p-8 min-w-[360px]">
				<h2 className="text-2xl font-bold mb-4 text-center">Players</h2>
				<ul className="space-y-3">
					{gameState.players.map((player: Player) => (
						<PlayerListItem key={player.name} player={player} />
					))}
				</ul>
			</div>
			<div>
				<ReadyButton self={self} />
			</div>

			<div className="text-gray-500">
				<p>
					You are in room: <span className="font-bold">{gameState.roomId}</span>
				</p>
				<p>
					The category is: <span className="font-bold">{gameState.category}</span>
				</p>
			</div>
		</div>
	)
}

function PlayerListItem({ player }: { player: Player }) {
	return (
		<li className="flex items-center">
			<div
				className="w-6 h-6 rounded-full mr-3"
				suppressHydrationWarning
				style={{ backgroundColor: player.avatarColor, opacity: 0.6 }}
			/>
			<span className="font-bold flex-1">{player.name}</span>
			{player.ready ? (
				<span className="text-green-500 text-sm flex items-center">
					<svg
						className="w-4 h-4 mr-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					/>
					ready!
				</span>
			) : (
				<span className="text-gray-500 text-sm">...waiting</span>
			)}
		</li>
	)
}

function ReadyButton({ self }: { self: string }) {
	const [ready, setReady] = useState(false)
	const { dispatch, gameState } = useGameState() as {
		dispatch: (a: Action) => void
		gameState: GameInfo
	}
	const handleClick = () => {
		setReady(!ready)
		dispatch({ type: 'toggle-ready', payload: { name: self } })
	}
	const message =
		gameState.players.length < 2
			? 'Waiting for more players...'
			: 'Game begins when all players are ready...'

	return (
		<div className="flex flex-col gap-3 items-center">
			<Button variant={ready ? 'disabled' : 'primary'} onClick={handleClick}>
				{ready ? '...' : 'Ready?'}
			</Button>
			{ready && <p>{message}</p>}
		</div>
	)
}
