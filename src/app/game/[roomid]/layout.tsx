import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
	return <main className="w-full">{children}</main>
}
