import type { Locator, Page } from '@playwright/test'

export class GamePage {
	public readonly readyButton: Locator
	public readonly readyButtonDisabled: Locator
	public readonly imposterText: Locator
	public readonly answerGrid: Locator
	public readonly readyToVoteButton: Locator
	public readonly waitingPlayers: Locator
	public readonly roomId: Locator
	public readonly votePanel: Locator
	public readonly playerVoteButtons: Locator
	public readonly beginNextRoundButton: Locator
	public readonly playerScorePanel: Locator
	public readonly playerScoreItem: Locator
	public readonly imposterBadge: Locator
	public readonly infoBarRound: Locator
	constructor(private readonly page: Page) {
		this.readyButton = page.getByRole('button').getByText('Ready')
		this.readyButtonDisabled = page.getByRole('button').getByText('...')
		this.readyToVoteButton = page.getByRole('button').getByText('Ready to vote?')
		this.imposterText = page.getByText('You are the imposter')
		this.answerGrid = page.getByTestId('answer-grid')
		this.votePanel = page.getByText('Who is the imposter?')
		this.playerVoteButtons = page.getByTestId('player-vote-list').getByRole('button')
		this.waitingPlayers = page.getByRole('list')
		this.roomId = page.getByTestId('room-id')
		this.beginNextRoundButton = page.getByRole('button').getByText('Begin next round')
		this.playerScorePanel = page.getByTestId('player-score-panel')
		this.playerScoreItem = page.getByTestId('player-score-item')
		this.imposterBadge = page.getByTestId('imposter-badge').getByText('IMPOSTER')
		this.infoBarRound = page.getByTestId('info-bar-round')
	}

	async getNumberOfWaitingPlayers() {
		return this.waitingPlayers.locator('li').count()
	}

	async getHasHighlightedAnswer() {
		const items = this.answerGrid.getByTestId('answer-item')
		const highlightedItems = await items.evaluateAll((nodes) =>
			nodes.map((node) => node.getAttribute('class')).filter((c) => c && c.includes('bg-green-100'))
		)
		return highlightedItems.length
	}

	async getNumberOfPlayerScoreItems() {
		return this.playerScorePanel.locator('li').count()
	}

	async getURL() {
		return this.page.url()
	}
}
