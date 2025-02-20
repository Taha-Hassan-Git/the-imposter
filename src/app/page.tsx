import { Brain, Gamepad, Trophy, Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { GameInfo } from '../../game-logic/types'
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
		let data: GameInfo
		try {
			const res = await fetch(`${PARTYKIT_URL}/party/${roomId}`, {
				method: 'POST',
				body: JSON.stringify({ playerName, category, roomId }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			data = (await res.json()) as GameInfo
		} catch (error) {
			console.error(`Error fetching or creating room ${roomId}`, error)
			redirect('/?error=Room+not+found')
		}
		redirect(`/game/${data.roomId}?playerName=${playerName}&category=${data.category}`)
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
			<div className="grid md:grid-cols-2 gap-8">
				<div className="flex items-start space-x-4">
					<Users className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">Join or Create a Game</h3>
						<p className="text-gray-600">
							Gather 3 or more players. One player will be secretly chosen as the imposter.
						</p>
					</div>
				</div>

				<div className="flex items-start space-x-4">
					<Brain className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">Learn the Secret</h3>
						<p className="text-gray-600">
							Regular players see the chosen word. The imposter must figure it out from context.
						</p>
					</div>
				</div>

				<div className="flex items-start space-x-4">
					<Gamepad className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">Play the Round</h3>
						<p className="text-gray-600">
							Take turns describing the word. The imposter bluffs their way through. Don&apos;t give
							the word away though, or the imposter will win!
						</p>
					</div>
				</div>

				<div className="flex items-start space-x-4">
					<Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
					<div>
						<h3 className="font-semibold text-gray-900 mb-2">Vote and Score</h3>
						<p className="text-gray-600">
							Vote for who you think is the imposter. Score points for correct guesses or successful
							deception.
						</p>
					</div>
				</div>
			</div>
		</Panel>
	)
}
