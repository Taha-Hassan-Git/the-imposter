import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import NewGameForm from './components/NewGameForm'
import { PARTYKIT_URL } from './env'
import { generateRoomId } from './utils/generateRoomId'

export default function Home() {
	async function createOrJoinRoom(formData: FormData) {
		'use server'
		const playerName = formData.get('name')
		let roomId = formData.get('roomId')
		let category = formData.get('category')

		if (!roomId) {
			roomId = generateRoomId()
			await fetch(`${PARTYKIT_URL}/party/${roomId}`, {
				method: 'POST',
				body: JSON.stringify({ playerName, category, roomId }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
		} else {
			try {
				const res = await fetch(`${PARTYKIT_URL}/party/${roomId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})
				const data = await res.json()
				category = data.category
			} catch (error) {
				console.error(`Error fetching room ${roomId}`, error)
				redirect('/?error=Room+not+found')
			}
		}
		redirect(`/game/${roomId}?playerName=${playerName}&category=${category}`)
	}
	return (
		<div className="w-full">
			<form className="w-full flex justify-center items-center" action={createOrJoinRoom}>
				<Suspense fallback={<div>Loading...</div>}>
					<NewGameForm />
				</Suspense>
			</form>
		</div>
	)
}
