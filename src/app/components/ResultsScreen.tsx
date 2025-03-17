import { Crown, VenetianMask } from 'lucide-react'
import { Player } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { GreenMessage, RedMessage, YellowMessage } from './Message'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'
import { ReadyBtnWithPresence } from './ReadyBtnWithPresence'

export function ResultsScreen() {
	const { gameState } = useActiveGame()
	const mostVotedPlayer = gameState.players.reduce((acc, player) =>
		player.votes.length > acc.votes.length ? player : acc
	)
	const imposter = gameState.players.find((player) => player.imposter)!
	const avoidedDetection = mostVotedPlayer.id !== imposter.id
	const guessedCorrectly = imposter.guess === gameState.answer
	return (
		<>
			<MessagePanel avoidedDetection={avoidedDetection} guessedCorrectly={guessedCorrectly} />
			<ScorePanel avoidedDetection={avoidedDetection} guessedCorrectly={guessedCorrectly} />
			<ReadyBtnWithPresence text={'Begin next round'} />
		</>
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

	const votedForImposter = imposter.votes.includes(localPlayer.id)
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
					<YellowMessage message={'You voted for the imposter, but they got away!'} />
				) : (
					<RedMessage message={'They got away! The imposter was ' + imposter.name + '.'} />
				)
			) : guessedCorrectly ? (
				<YellowMessage message="You got the imposter, but they guessed the answer!" />
			) : (
				<GreenMessage message={'You got them! The imposter was ' + imposter.name + '.'} />
			)}
		</>
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
			<ul data-testid="player-score-panel" className="flex flex-col gap-4">
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
		<li
			data-testid="player-score-item"
			className="bg-white rounded-xl shadow-md transition-all border border-gray-200 overflow-hidden"
		>
			{isImposter && <ImposterBadge />}
			<MainSection player={player} scoreDifference={scoreDifference} />
			<PlayerVotes player={player} />
		</li>
	)
}

function ImposterBadge() {
	return (
		<div
			data-testid="imposter-badge"
			className="bg-red-50 py-2 px-4 flex items-center gap-2 border-b border-red-100"
		>
			<VenetianMask className="w-4 h-4 text-red-500" />
			<p className="text-sm font-medium text-red-600">IMPOSTER</p>
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
								player={gameState.players.find((player) => player.id === vote)!}
							/>
						))
					)}
				</div>
			</div>
		</div>
	)
}
