import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'
import { Panel } from './Panel'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'

export function ReadyBtnWithPresence({ text }: { text: string }) {
	const { dispatch } = useActiveGame()
	const localPlayer = useLocalPlayer()

	function toggleReady() {
		dispatch({ type: 'toggle-ready', payload: { id: localPlayer.id } })
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
						{localPlayer.ready ? '...' : text}
					</Button>
				</div>
			</div>
			<span className="flex w-full items-center justify-center gap-1 mt-2 p-3 bg-gray-100 border rounded-b-lg">
				<p className="text-nowrap text-xs text-gray-500">Players ready:</p>
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
						style={{ transform: `translateX(-${i * 8}px)`, zIndex: gameState.players.length - i }}
						key={player.name}
						className="flex items-center gap-2"
					>
						<PlayerInitialsIcon className="!w-5 !h-5 text-xs" showReady player={player} />
					</div>
				))}
		</div>
	)
}
