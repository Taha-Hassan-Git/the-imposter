import { Player } from '../../../game-logic/types'

export function PlayerInitialsIcon({
	player,
	showReady = false,
}: {
	player: Player
	showReady?: boolean
}) {
	const initials = player.name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()

	return (
		<div
			className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${
				showReady && !player.ready ? 'bg-gray-300' : ''
			}`}
			style={showReady && !player.ready ? {} : { backgroundColor: player.avatarColor }}
		>
			{initials}
		</div>
	)
}
