import classNames from 'classnames'
import { Player } from '../../../game-logic/types'
export function PlayerInitialsIcon({
	player,
	showReady = false,
	className,
}: {
	player: Player
	showReady?: boolean
	className?: string
}) {
	const initials = player.name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
	const styles = classNames(
		'w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm',
		className
	)
	return (
		<div
			className={`${styles} ${showReady && !player.ready ? 'bg-gray-300' : ''}`}
			style={showReady && !player.ready ? {} : { backgroundColor: player.avatarColor }}
		>
			{initials}
		</div>
	)
}
