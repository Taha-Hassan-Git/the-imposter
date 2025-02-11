import { Crown, VenetianMask } from 'lucide-react'
import { Player } from '../../../game-logic/types'
import { useActiveGame, useLocalPlayer } from '../hooks/useGameState'
import { Button } from './Button'
import { Panel } from './Panel'
import { PlayerInitialsIcon } from './PlayerInitialsIcon'
export function ResultsScreen() {
	return (
		<div className="flex flex-col gap-5 items-center w-full">
			<MessagePanel />
			<NextRoundButton />
			<ScorePanel />
		</div>
	)
}

function MessagePanel() {
	const localPlayer = useLocalPlayer()
	const { gameState } = useActiveGame()
	const imposter = gameState.players.find((player) => player.imposter)!
	const mostVotedPlayer = gameState.players.reduce((acc, player) =>
		player.votes.length > acc.votes.length ? player : acc
	)
	const isImposter = localPlayer.imposter
	const avoidedDetection = mostVotedPlayer.name !== imposter.name
	const guessedCorrectly = imposter.guess === gameState.answer
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

function ScorePanel() {
	const { gameState } = useActiveGame()
	return (
		<div className="w-full">
			{/* On mobile, remove the panel styling */}
			<div className="xs:bg-white xs:p-4 xs:rounded-lg">
				<ul className="flex flex-col gap-4">
					{gameState.players
						.sort((a, b) => (a.score > b.score ? -1 : 1))
						.map((player) => (
							<PlayerScoreItem key={player.name} player={player} />
						))}
				</ul>
			</div>
		</div>
	)
}

function PlayerScoreItem({ player }: { player: Player }) {
	const { gameState } = useActiveGame()
	const highestScore = gameState.players.reduce(
		(acc, player) => (player.score > acc ? player.score : acc),
		0
	)
	const isImposter = player.imposter
	return (
		<li className="bg-white xs:bg-gray-50 px-6 py-4 flex flex-col gap-2 items-start rounded-lg shadow-sm ">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center space-x-2 gap-1">
					<PlayerInitialsIcon className="!w-10 !h-10" player={player} />
					<div>
						<p className="text-xl">{player.name}</p>
						<span className="flex items-center gap-1">
							{isImposter && (
								<>
									<VenetianMask className="w-5 h-5 text-gray-500" />
									<p className="text-sm text-gray-500">The imposter</p>
								</>
							)}
						</span>
					</div>
				</div>
				<span className="text-2xl font-bold text-gray-700">
					{player.score === highestScore ? (
						<div className="flex flex-col items-center gap-1">
							<Crown className="!w-4 !h-4 text-yellow-500" />
							<span className="group-hover:underline">{player.score}</span>
						</div>
					) : (
						<div className="text-center">{player.score}</div>
					)}
				</span>
			</div>
			<div className="flex gap-1 text-sm text-gray-500 border-t w-full mt-1 pt-1 items-center">
				Votes:
				<div className="flex items-center gap-1">
					{player.votes.length === 0 ? (
						<span className="text-gray-300">None</span>
					) : (
						<span>{player.votes.length}</span>
					)}
					<span className="flex items-center justify-center gap-0">
						{player.votes.map((vote) => {
							return (
								<PlayerInitialsIcon
									className="!w-4 !h-4 text-[8px]"
									key={vote}
									player={gameState.players.find((player) => player.name === vote)!}
								/>
							)
						})}
					</span>
				</div>
			</div>
		</li>
	)
}
