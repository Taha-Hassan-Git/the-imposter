'use client'
import { VenetianMask } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Panel } from './Panel'

export function LoadingScreen() {
	const router = useRouter()

	useEffect(() => {
		const timeout = setTimeout(() => {
			router.push('/?error=Error+loading+game')
		}, 1000 * 60)

		return () => clearTimeout(timeout)
	}, [router])
	return (
		<Panel variant="column" className="animate-pulse self-center mt-5 h-96 justify-center">
			<VenetianMask className="w-48 h-48 text-gray-400" />
			<p className="text-gray-700">Loading game...</p>
		</Panel>
	)
}
