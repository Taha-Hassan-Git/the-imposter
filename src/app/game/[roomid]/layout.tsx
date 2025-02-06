import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
	return <main className="w-full max-w-screen">{children}</main>
}
