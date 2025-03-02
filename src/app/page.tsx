import { redirect } from 'next/navigation'
import { GameInfo } from '../../game-logic/types'
import { HowToPlayContent } from './components/HowToPlayContent'
import { Lockup } from './components/Lockup'
import NewGameForm from './components/NewGameForm'
import { Panel } from './components/Panel'
import { PARTYKIT_URL } from './env'
import { generateRoomId } from './utils/generateRoomId'

export default function Home() {
	async function createOrJoinRoom(formData: FormData) {
		'use server'
		const playerName = formData.get('name')
		const roomId = formData.get('roomId') || generateRoomId()
		const category = formData.get('category')
		const playerId = formData.get('playerId')
		let data: GameInfo
		try {
			const res = await fetch(`${PARTYKIT_URL}/party/${roomId}`, {
				method: 'POST',
				body: JSON.stringify({ playerName, category, roomId, playerId }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			data = (await res.json()) as GameInfo
		} catch (error) {
			console.error(`Error fetching or creating room ${roomId}`, error)
			redirect('/?error=Room+not+found')
		}
		redirect(`/game/${data.roomId}`)
	}

	return (
		<div className="min-h-screen max-w-[500px]">
			<div className="pt-16 flex flex-col items-center gap-4">
				<Lockup size="large" />
				<form className="w-full flex justify-center items-center" action={createOrJoinRoom}>
					<NewGameForm />
				</form>
				<HowToPlay />
			</div>
		</div>
	)
}

function HowToPlay() {
	return (
		<Panel>
			<h2 className="text-2xl font-bold text-gray-900 mb-6">How to Play</h2>
			<HowToPlayContent />
		</Panel>
	)
}
