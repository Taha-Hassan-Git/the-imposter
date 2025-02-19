import { GamePage } from './fixtures/GamePage'
import { HomePage } from './fixtures/HomePage'
import { expect, test } from './fixtures/the-imposter-test'

test.beforeEach(async ({ homePage }) => {
	await homePage.goto()
})

test('Should load homepage', async ({ homePage }) => {
	expect(homePage.createRoomFormButton).toBeHidden()
	expect(homePage.header).toBeTruthy()
})

test('Can toggle between create and join room forms', async ({ homePage }) => {
	await homePage.createNewButton.click()
	expect(homePage.createRoomFormButton).toBeVisible()
	await homePage.joinExistingButton.click()
	expect(homePage.createRoomFormButton).toBeHidden()
	expect(homePage.joinRoomFormButton).toBeVisible()
})

test('Can create a room', async ({ homePage, gamePage }) => {
	await homePage.createNewButton.click()
	expect(homePage.createRoomFormButton).toBeVisible()
	expect(homePage.createRoomFormButton).toBeDisabled()
	await homePage.nameInput.fill('PlayerName')
	expect(homePage.createRoomFormButton).toBeEnabled()
	await homePage.createRoomFormButton.click()
	await expect(gamePage.readyButton).toBeVisible()
})

test('Can create a room and join as another user', async ({ browser, homePage, gamePage }) => {
	// Create a room as the first user
	await homePage.createNewButton.click()
	expect(homePage.createRoomFormButton).toBeVisible()
	expect(homePage.createRoomFormButton).toBeDisabled()
	await homePage.nameInput.fill('Player1')
	expect(homePage.createRoomFormButton).toBeEnabled()
	await homePage.createRoomFormButton.click()
	await expect(gamePage.readyButton).toBeVisible()

	// Get the room ID from the URL

	// remove params by slicing after the first question mark
	const roomId = await gamePage.getURL().then((url) => url.split('?')[0].split('/').pop()!)

	// Create a new browser context for the second user
	const context = await browser.newContext()
	const page = await context.newPage()
	const secondHomePage = new HomePage(page)
	const secondGamePage = new GamePage(page)

	// Join the room as the second user
	await secondHomePage.goto()
	await secondHomePage.joinExistingButton.click()
	await secondHomePage.roomIdInput.fill(roomId)
	await secondHomePage.nameInput.fill('Player2')
	await secondHomePage.joinRoomFormButton.click()
	await expect(secondGamePage.readyButton).toBeVisible()
	expect(await secondGamePage.getPlayers()).toBe(2)

	// Clean up
	await context.close()
})
