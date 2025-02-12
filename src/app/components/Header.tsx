'use client'

import { VenetianMask } from 'lucide-react'

export default function Header() {
	return (
		<header className="w-full bg-white border-b shadow-md">
			<div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo and Title */}
					<div className="flex items-center space-x-3">
						<div className="p-2 bg-blue-50 rounded-lg">
							<VenetianMask className="h-7 w-7" />
						</div>
						<div className="flex flex-col">
							<h1 className="text-2xl font-bold text-gray-800">The Imposter</h1>
							<p className="text-xs text-gray-500">Who doesn&#39;t belong?</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
