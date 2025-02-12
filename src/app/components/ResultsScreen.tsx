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
		<div className="w-full bg-gray-50">
			<ul className="flex flex-col gap-4">
				{gameState.players
					.sort((a, b) => (a.score > b.score ? -1 : 1))
					.map((player) => (
						<PlayerScoreItem key={player.name} player={player} />
					))}
			</ul>
		</div>
	)
}

function PlayerScoreItem({ player }: { player: Player }) {
	const { gameState } = useActiveGame()
	const highestScore = gameState.players.reduce(
		(acc, player) => (player.score > acc ? player.score : acc),
		0
	)
	const imposter = gameState.players.find((player) => player.imposter)!
	const mostVotedPlayer = gameState.players.reduce((acc, player) =>
		player.votes.length > acc.votes.length ? player : acc
	)
	const isImposter = player.imposter
	const avoidedDetection = mostVotedPlayer.name !== imposter.name
	const guessedCorrectly = imposter.guess === gameState.answer
	const votedForImposter = imposter.votes.includes(player.name)
	const scoreDifference = getScoreDifference()

	function getScoreDifference() {
		if (isImposter) {
			if (avoidedDetection) {
				return 3
			} else if (guessedCorrectly) {
				return 2
			} else {
				return 0
			}
		} else if (votedForImposter) {
			return 1
		} else {
			return 0
		}
	}
	return (
		<li className="bg-white flex flex-col items-start rounded-lg shadow-sm border">
			<span className="flex items-center gap-1 pt-2 px-5">
				{isImposter && (
					<>
						<VenetianMask className="w-5 h-5 text-gray-500" />
						<p className="text-sm text-gray-500">The imposter</p>
					</>
				)}
			</span>
			<div className="flex px-4 py-4 items-center justify-between w-full">
				<div className="flex items-center space-x-2 gap-1">
					<PlayerInitialsIcon className="!w-10 !h-10" player={player} />
					<div className="flex gap-4">
						<p className="text-xl">{player.name}</p>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<span className="text-xs font-light text-gray-500">score:</span>
					<span className="text-2xl font-bold text-gray-700 flex items-center gap-2">
						{player.score === highestScore ? (
							<div className="flex flex-col items-center gap-1">
								<Crown className="!w-4 !h-4 text-yellow-500" />
								<span className="group-hover:underline">{player.score}</span>
							</div>
						) : (
							<div className="text-center">{player.score}</div>
						)}
						<span className="text-sm text-gray-500">
							<span>{scoreDifference > 0 ? '+' : ''}</span>
							{scoreDifference}
						</span>
					</span>
				</div>
			</div>
			<div className="flex gap-1 text-sm bg-gray-100 text-gray-500 w-full items-center px-4 py-2 rounded-b-lg border-t">
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
