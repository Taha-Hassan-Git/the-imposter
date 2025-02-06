import { Player } from '../../../game-logic/types'

export function PlayerInitialsIcon({ player }: { player: Player }) {
	// Get player initials
	const initials = player.name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()

	return (
		<div
			style={{ backgroundColor: player.ready ? player.avatarColor : 'gray' }}
			className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white border border-black"
		>
			{initials}
		</div>
	)
}
