'use client'

import { Lockup } from './Lockup'

export default function Header() {
	return (
		<header className="w-full bg-white border-b shadow-md">
			<div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Lockup />
				</div>
			</div>
		</header>
	)
}
