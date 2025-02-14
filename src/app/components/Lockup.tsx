import { VenetianMask } from 'lucide-react'
import { avatarColors } from '../../../game-logic/types'

export function Lockup({ size }: { size?: 'small' | 'large' }) {
	return (
		<div>
			<div className="flex items-center space-x-3">
				<div className="p-2 bg-blue-50 rounded-lg">
					<VenetianMask className={size === 'large' ? 'h-12 w-12' : 'h-7 w-7'} />
				</div>
				<div className="flex flex-col">
					<h1 className={`font-bold text-gray-800 ${size === 'large' ? 'text-4xl' : 'text-2xl'}`}>
						The Imposter
					</h1>
					<div className="flex gap-0 w-full items-center justify-center">
						{avatarColors.map((color, index) => (
							<div
								key={index}
								className={size === 'large' ? 'w-[18px] h-2' : 'w-3 h-1'}
								suppressHydrationWarning
								style={{ backgroundColor: color }}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
