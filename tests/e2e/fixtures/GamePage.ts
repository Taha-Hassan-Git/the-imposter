import type { Locator, Page } from '@playwright/test'
export class GamePage {
	public readonly readyButton: Locator
	public readonly waitingPlayers: Locator
	public readonly roomId: Locator
	constructor(private readonly page: Page) {
		this.readyButton = page.getByRole('button').getByText('Ready?')
		this.waitingPlayers = page.getByRole('list')
		this.roomId = page.getByTestId('room-id')
	}

	async getNumberOfPlayers() {
		return this.waitingPlayers.locator('li').count()
	}

	async getURL() {
		return this.page.url()
	}
}
