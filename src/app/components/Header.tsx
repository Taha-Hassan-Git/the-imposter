'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { CircleHelp } from 'lucide-react'
import Link from 'next/link'
import { HowToPlayContent } from './HowToPlayContent'
import { Lockup } from './Lockup'

export default function Header() {
	return (
		<header className="w-full bg-white border-b shadow-md">
			<div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<Link href="/">
						<Lockup />
					</Link>
					<HowToPlayDialog />
				</div>
			</div>
		</header>
	)
}

function HowToPlayDialog() {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button className="bg-gray-100 p-2 border border-gray-200 shadow-sm rounded-lg">
					<CircleHelp className="w-7 h-7 text-gray-500" />
				</button>
			</Dialog.Trigger>
			<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
			<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-lg">
				<Dialog.DialogTitle className="text-2xl font-bold text-gray-900 mb-6">
					How to Play
				</Dialog.DialogTitle>
				<HowToPlayContent />
			</Dialog.Content>
		</Dialog.Root>
	)
}
