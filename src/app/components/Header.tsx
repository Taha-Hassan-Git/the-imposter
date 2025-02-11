import { VenetianMask } from 'lucide-react'

export default function Header() {
	return (
		<header className="w-full bg-white border-b shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

			{/* Game Status Bar - shows when in game */}
			<div className="bg-gray-50 border-t border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-10 text-sm">
						<div className="flex items-center space-x-4">
							<span className="flex items-center">
								<div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
								<span className="text-gray-600">Room: </span>
								<span className="ml-1 font-medium rounded-full bg-gray-300 px-2 p-1 text-xs text-gray-900">
									fat-gay-bee
								</span>
							</span>
							<span className="text-gray-300">|</span>
							<span className="flex items-center">
								<span className="text-gray-600">Players: </span>
								<span className="ml-1 font-medium text-gray-900"></span>
							</span>
						</div>
						<div className="flex items-center space-x-2 rounded-full bg-gray-300 px-2 p-1 text-xs text-gray-900">
							<span className="text-gray-600">Round:</span>
							<span className="font-medium text-gray-900">0</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
