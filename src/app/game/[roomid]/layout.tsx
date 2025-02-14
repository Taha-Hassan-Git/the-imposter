import { ReactNode } from 'react'
import Header from '../../components/Header'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<main className="w-full max-w-[500px]">{children}</main>
		</>
	)
}
