import { Brain, Gamepad, Trophy, Users } from 'lucide-react'
import { redirect } from 'next/navigation'
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
		<div className="min-h-screen ">
			<div className="max-w-4xl mx-auto py-12 px-4">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to The Imposter</h1>
					<p className="text-xl text-gray-600 mb-8">
						A social deduction game. (Kind of like werewolf!)
					</p>
				</div>

				{/* How to Play Section */}
				<div className="bg-white rounded-xl shadow-md p-8 mb-12">
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
									Take turns describing the word. The imposter bluffs their way through. Don&apos;t
									give the word away though, or the imposter will win!
								</p>
							</div>
						</div>

						<div className="flex items-start space-x-4">
							<Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">Vote and Score</h3>
								<p className="text-gray-600">
									Vote for who you think is the imposter. Score points for correct guesses or
									successful deception.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Categories Section */}
				<div className="bg-white rounded-xl shadow-md p-8 mb-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Game Categories</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="p-4 bg-blue-50 rounded-lg">
							<h3 className="font-semibold text-gray-900 mb-2">🎬 Films</h3>
							<p className="text-gray-600">Classic movies and contemporary films</p>
						</div>
						<div className="p-4 bg-green-50 rounded-lg">
							<h3 className="font-semibold text-gray-900 mb-2">🦁 Animals</h3>
							<p className="text-gray-600">Creatures from around the world</p>
						</div>
						<div className="p-4 bg-yellow-50 rounded-lg">
							<h3 className="font-semibold text-gray-900 mb-2">🌍 Countries</h3>
							<p className="text-gray-600">Nations and their characteristics</p>
						</div>
						<div className="p-4 bg-red-50 rounded-lg">
							<h3 className="font-semibold text-gray-900 mb-2">⚽ Sports</h3>
							<p className="text-gray-600">Athletic activities and competitions</p>
						</div>
					</div>
				</div>
				<form className="w-full flex justify-center items-center" action={createOrJoinRoom}>
					<NewGameForm />
				</form>
			</div>
		</div>
	)
}
