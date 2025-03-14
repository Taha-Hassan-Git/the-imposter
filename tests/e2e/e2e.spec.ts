import { expect, PlayerContext, test } from './fixtures/the-imposter-test'

test.beforeEach(async ({ homePage }) => {
	await homePage.goto()
})

test('Should load homepage', async ({ homePage }) => {
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

test('Can create a room and join as multiple users', async ({ createPlayerContext }) => {
	const [player1, player2, player3] = await createPlayerContext(3)

	await createRoom(player1, 'Player1')
	await expect(player1.gamePage.readyButton).toBeVisible()
	const roomId = await player1.gamePage.roomId.innerText()

	await joinRoom(player2, roomId, 'Player2')
	await expect(player2.gamePage.readyButton).toBeVisible()

	expect(await player1.gamePage.getNumberOfPlayers()).toBe(2)

	await joinRoom(player3, roomId, 'Player3')
	await expect(player3.gamePage.readyButton).toBeVisible()

	expect(await player1.gamePage.getNumberOfPlayers()).toBe(3)
})

test('Can join a game after inputting the same name as another player', async ({
	createPlayerContext,
}) => {
	const [player1, player2] = await createPlayerContext(2)

	await createRoom(player1, 'Player1')
	await expect(player1.gamePage.readyButton).toBeVisible()

	const roomId = await player1.gamePage.roomId.innerText()

	await joinRoom(player2, roomId, 'Player1')
	await expect(player2.gamePage.readyButton).toBeVisible()

	expect(await player1.gamePage.getNumberOfPlayers()).toBe(2)
	expect(await player2.gamePage.getNumberOfPlayers()).toBe(2)
})

test('Can leave a room by closing page', async ({ createPlayerContext }) => {
	const [player1, player2] = await createPlayerContext(2)

	await createRoom(player1, 'Player1')
	await expect(player1.gamePage.readyButton).toBeVisible()

	const roomId = await player1.gamePage.roomId.innerText()

	await joinRoom(player2, roomId, 'Player2')
	await expect(player2.gamePage.readyButton).toBeVisible()

	expect(await player1.gamePage.getNumberOfPlayers()).toBe(2)

	// player 2 closes the old tab
	await player2.page.close()
	// todo: we should await the element being removed instead
	await player1.page.waitForTimeout(1000)
	// player 2 has now left the game
	expect(await player1.gamePage.getNumberOfPlayers()).toBe(1)

	// todo: test that player 2 can rejoin the game

	// player2.homePage2.goto()
	// player2.homePage2.joinExistingButton.click()
	// expect(player2.homePage2.joinRoomFormButton).toBeVisible()
	// player2.homePage2.roomIdInput.fill(roomId)
	// player2.homePage2.nameInput.fill('Player2')
	// player2.homePage2.joinRoomFormButton.click()

	// expect(player2.gamePage2.readyButton).toBeVisible()
	// await player1.page.waitForTimeout(1000)
	// expect(await player1.gamePage.getNumberOfPlayers()).toBe(2)
})

async function createRoom(context: PlayerContext, name: string) {
	await context.homePage.goto()
	await context.homePage.createNewButton.click()
	await context.homePage.nameInput.fill(name)
	await context.homePage.createRoomFormButton.click()
}

async function joinRoom(context: PlayerContext, roomId: string, name: string) {
	await context.homePage.goto()
	await context.homePage.joinExistingButton.click()
	await context.homePage.roomIdInput.fill(roomId)
	await context.homePage.nameInput.fill(name)
	await context.homePage.joinRoomFormButton.click()
}
