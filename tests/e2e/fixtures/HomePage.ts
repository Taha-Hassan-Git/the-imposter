import type { Locator, Page } from '@playwright/test'

export class HomePage {
	public readonly createNewButton: Locator
	public readonly joinExistingButton: Locator
	public readonly createRoomFormButton: Locator
	public readonly joinRoomFormButton: Locator
	public readonly header: Locator
	public readonly nameInput: Locator
	public readonly roomIdInput: Locator
	constructor(private readonly page: Page) {
		this.createNewButton = page.getByRole('button').getByText('Create new room')
		this.joinExistingButton = page.getByRole('button').getByText('Join existing room')
		this.createRoomFormButton = page.getByRole('button').getByText('Create Room')
		this.joinRoomFormButton = page.getByRole('button').getByText('Join Room')
		this.header = page.getByText('The Imposter')
		this.nameInput = page.getByRole('textbox', { name: 'Your Name:' })
		this.roomIdInput = page.getByRole('textbox', { name: 'Room Id:' })
	}
	async goto() {
		await this.page.goto('http://localhost:3000/')
	}
}
