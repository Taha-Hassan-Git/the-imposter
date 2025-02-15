import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'The Imposter',
	description: 'A social deduction party game',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<link rel="icon" href="favicon.svg" sizes="any" />
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 w-screen`}
			>
				<div className="flex flex-col w-full items-center">{children}</div>
			</body>
		</html>
	)
}
