import { Crown, VenetianMask } from 'lucide-react'
import { Player } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'
import { Panel } from './Panel'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'
export function ResultsScreen() {
	const { gameState } = useActiveGame()
	const mostVotedPlayer = gameState.players.reduce((acc, player) =>
		player.votes.length > acc.votes.length ? player : acc
	)
	const imposter = gameState.players.find((player) => player.imposter)!
	const avoidedDetection = mostVotedPlayer.name !== imposter.name
	const guessedCorrectly = imposter.guess === gameState.answer
	return (
		<div className="flex flex-col gap-5 items-center w-full">
			<MessagePanel avoidedDetection={avoidedDetection} guessedCorrectly={guessedCorrectly} />
			<NextRoundButton />
			<ScorePanel avoidedDetection={avoidedDetection} guessedCorrectly={guessedCorrectly} />
		</div>
	)
}

function MessagePanel({
	avoidedDetection,
	guessedCorrectly,
}: {
	avoidedDetection: boolean
	guessedCorrectly: boolean
}) {
	const localPlayer = useLocalPlayer()
	const { gameState } = useActiveGame()
	const imposter = gameState.players.find((player) => player.imposter)!

	const isImposter = localPlayer.imposter

	const votedForImposter = imposter.votes.includes(localPlayer.name)
	return (
		<>
			{isImposter ? (
				avoidedDetection ? (
					<GreenMessage message={'You evaded detection!'} />
				) : guessedCorrectly ? (
					<GreenMessage message={'You were caught, but guessed the answer!'} />
				) : (
					<RedMessage message={'You were caught!'} />
				)
			) : avoidedDetection ? (
				votedForImposter ? (
					<RedMessage message={'They got away! The imposter was ' + imposter.name + '.'} />
				) : (
					<YellowMessage message={'You voted for the imposter, but they got away!'} />
				)
			) : guessedCorrectly ? (
				<YellowMessage message="You got the imposter, but they guessed the answer!" />
			) : (
				<GreenMessage message={'You got them! The imposter was ' + imposter.name + '.'} />
			)}
		</>
	)
}

function YellowMessage({ message }: { message: string }) {
	return (
		<Panel className="!bg-yellow-50 border-2 border-yellow-200 max-w-[90%] mt-4">{message}</Panel>
	)
}

function RedMessage({ message }: { message: string }) {
	return <Panel className="!bg-red-50 border-2 border-red-200 max-w-[90%] mt-4">{message}</Panel>
}

function GreenMessage({ message }: { message: string }) {
	return (
		<Panel className="!bg-green-50 border-2 border-green-200 max-w-[90%] mt-4">{message}</Panel>
	)
}

function NextRoundButton() {
	const { dispatch } = useActiveGame()
	const localPlayer = useLocalPlayer()
	function handleNextRound() {
		dispatch({ type: 'toggle-ready', payload: { name: localPlayer.name } })
	}

	return (
		<Panel>
			<Button
				className="w-full"
				onClick={handleNextRound}
				variant={localPlayer.ready ? 'disabled' : 'primary'}
			>
				{localPlayer.ready ? 'waiting...' : 'Begin next round'}
			</Button>
		</Panel>
	)
}

function ScorePanel({
	avoidedDetection,
	guessedCorrectly,
}: {
	avoidedDetection: boolean
	guessedCorrectly: boolean
}) {
	const { gameState } = useActiveGame()
	return (
		<div className="w-full bg-gray-50">
			<ul className="flex flex-col gap-4">
				{gameState.players
					.sort((a, b) => (a.score > b.score ? -1 : 1))
					.map((player) => (
						<PlayerScoreItem
							avoidedDetection={avoidedDetection}
							guessedCorrectly={guessedCorrectly}
							key={player.name}
							player={player}
						/>
					))}
			</ul>
		</div>
	)
}

const PlayerScoreItem = ({
	player,
	avoidedDetection,
	guessedCorrectly,
}: {
	player: Player
	avoidedDetection: boolean
	guessedCorrectly: boolean
}) => {
	const { gameState } = useActiveGame()

	const imposter = gameState.players.find((player) => player.imposter)!

	const isImposter = player.imposter
	const votedForImposter = imposter.votes.includes(player.name)

	const scoreDifference = isImposter
		? avoidedDetection
			? 3
			: guessedCorrectly
				? 2
				: 0
		: votedForImposter
			? 1
			: 0

	return (
		<li className="bg-white rounded-xl shadow-md transition-all border border-gray-200 overflow-hidden">
			{isImposter && <ImposterBadge />}
			<MainSection player={player} scoreDifference={scoreDifference} />
			<PlayerVotes player={player} />
		</li>
	)
}

function ImposterBadge() {
	return (
		<div className="bg-red-50 py-2 px-4 flex items-center gap-2 border-b border-red-100">
			<VenetianMask className="w-4 h-4 text-red-500" />
			<p className="text-sm font-medium text-red-600">Imposter</p>
		</div>
	)
}

function MainSection({ player, scoreDifference }: { player: Player; scoreDifference: number }) {
	const { gameState } = useActiveGame()
	const highestScore = gameState.players.reduce(
		(acc, player) => (player.score > acc ? player.score : acc),
		0
	)
	return (
		<div className="p-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<PlayerInitialsIcon player={player} />
				<div>
					<h3 className="text-lg font-medium text-gray-900">{player.name}</h3>
					{scoreDifference > 0 && (
						<p className="text-sm text-green-600">+{scoreDifference} this round</p>
					)}
				</div>
			</div>

			{/* Score */}
			<div className="flex flex-col items-end gap-1">
				<div className="flex items-center gap-2">
					<span className="text-2xl font-bold">{player.score}</span>
					{player.score === highestScore && <Crown className="w-5 h-5 text-yellow-500" />}
				</div>
				<p className="text-sm text-gray-500">points</p>
			</div>
		</div>
	)
}

function PlayerVotes({ player }: { player: Player }) {
	const { gameState } = useActiveGame()
	return (
		<div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-600">Votes:</span>
				<div className="flex -space-x-1">
					{player.votes.length === 0 ? (
						<span className="text-sm text-gray-400">None</span>
					) : (
						player.votes.map((vote) => (
							<PlayerInitialsIcon
								className="!w-4 !h-4 text-[8px]"
								key={vote}
								player={gameState.players.find((player) => player.name === vote)!}
							/>
						))
					)}
				</div>
			</div>
		</div>
	)
}
