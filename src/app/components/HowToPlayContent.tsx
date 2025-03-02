import { Brain, Gamepad, Trophy, Users } from 'lucide-react'

export function HowToPlayContent() {
	return (
		<div className="grid md:grid-cols-2 gap-8">
			<div className="flex items-start space-x-4">
				<Users className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
				<div>
					<h3 className="font-semibold text-gray-900 mb-2">Join or Create a Game</h3>
					<p className="text-gray-600">
						Gather 3 or more players and choose a category. One player will be secretly chosen as
						the imposter.
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
						the word away though, or the imposter will win! After 2 rounds, it&apos;s time to vote.
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
	)
}
