import QRCode from 'react-qr-code'
import { Player } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'
import { Panel } from './Panel'
import { Pill } from './Pill'

const URL =
	process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
		? 'https://the-imposter.vercel.app/'
		: 'http://192.168.1.119:3000'

export function WaitingScreen() {
	const { gameState } = useActiveGame()
	return (
		<>
			<Panel>
				<div className="max-h-[280px] overflow-y-scroll w-full">
					<div className="justify-between flex items-center align-middle mb-2">
						<div className="flex items-center gap-2">
							Category:
							<Pill>
								<p>{gameState.category[0].toUpperCase() + gameState.category.slice(1)}</p>
							</Pill>
						</div>
						<div className="flex items-center gap-2">
							Room ID:
							<Pill>
								<p data-testid={'room-id'}>{gameState.roomId}</p>
							</Pill>
						</div>
					</div>
					<div className="border-b mb-2"></div>
					<ul className="space-y-3 p-4">
						{gameState.players.map((player: Player) => (
							<PlayerListItem key={player.name} player={player} />
						))}
					</ul>
				</div>
				<div className="mt-4 w-full">
					<ReadyButton />
				</div>
			</Panel>
			<Panel variant="column">
				<p>Invite others with this link:</p>
				<div className="bg-gray-100 p-4 border rounded-lg mt-4">
					<QRCode size={120} value={URL + `?roomId=${gameState.roomId}`} />
				</div>
			</Panel>
		</>
	)
}

function PlayerListItem({ player }: { player: Player }) {
	return (
		<li className="flex items-center">
			<div
				className="w-6 h-6 rounded-full mr-3"
				suppressHydrationWarning
				style={{ backgroundColor: player.avatarColor }}
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

function ReadyButton() {
	const { dispatch, gameState } = useActiveGame()
	const localPlayer = useLocalPlayer()

	const handleClick = () => {
		dispatch({ type: 'toggle-ready', payload: { id: localPlayer.id } })
	}

	const message =
		gameState.players.length <= 2 ? 'Not enough players to start...' : '...waiting for the others'

	return (
		<div className="flex flex-col gap-3 items-center w-full">
			<Button
				className="w-full"
				variant={localPlayer.ready ? 'disabled' : 'primary'}
				onClick={handleClick}
			>
				{localPlayer.ready ? '...' : 'Ready?'}
			</Button>
			{localPlayer.ready && <p>{message}</p>}
		</div>
	)
}
