import { redirect } from 'next/navigation'
import { avatarColors } from '../../game-logic/types'
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
			<div className="flex gap-2">
				{avatarColors.map((color) => {
					return (
						<span
							key={color}
							style={{ backgroundColor: color }}
							className="rounded-full inline-block"
						>
							{color}
						</span>
					)
				})}
			</div>
			<form className="w-full flex justify-center items-center" action={createOrJoinRoom}>
				<NewGameForm />
			</form>
		</div>
	)
}
