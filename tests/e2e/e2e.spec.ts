import { expect, PlayerContext, test } from './fixtures/the-imposter-test'

test.describe('The Imposter Game', () => {
	// Simple UI element tests
	test.describe('Homepage', () => {
		test.beforeEach(async ({ homePage }) => {
			await homePage.goto()
		})

		test('Should load homepage elements', async ({ homePage }) => {
			expect(homePage.header).toBeTruthy()
			expect(homePage.createNewButton).toBeVisible()
			expect(homePage.joinExistingButton).toBeVisible()
		})

		test('Can toggle between create and join room forms', async ({ homePage }) => {
			// Test create form
			await homePage.createNewButton.click()
			expect(homePage.createRoomFormButton).toBeVisible()
			expect(homePage.joinRoomFormButton).toBeHidden()

			// Test create form validation
			expect(homePage.createRoomFormButton).toBeDisabled()
			await homePage.nameInput.fill('PlayerName')
			expect(homePage.createRoomFormButton).toBeEnabled()

			// Test join form
			await homePage.joinExistingButton.click()
			expect(homePage.createRoomFormButton).toBeHidden()
			expect(homePage.joinRoomFormButton).toBeVisible()
		})

		test('Can create a room and join the game', async ({ homePage, gamePage }) => {
			await homePage.createNewButton.click()
			await homePage.nameInput.fill('PlayerName')
			await homePage.createRoomFormButton.click()

			await expect(gamePage.readyButton).toBeVisible()
		})
	})

	// Game room functionality tests
	test.describe('Game Room', () => {
		test('Multiple users can join the same game room', async ({ createPlayerContext }) => {
			const [player1, player2, player3] = await createPlayerContext(3)

			// Host creates room
			const roomId = await createRoom(player1, 'Player1')

			// Player 2 joins
			await joinRoom(player2, roomId, 'Player2')
			await verifyPlayerCount(player1, 2)
			await verifyPlayerCount(player2, 2)

			// Player 3 joins
			await joinRoom(player3, roomId, 'Player3')
			await verifyPlayerCount(player1, 3)
			await verifyPlayerCount(player2, 3)
			await verifyPlayerCount(player3, 3)
		})

		test('Players with duplicate names can still join', async ({ createPlayerContext }) => {
			const [player1, player2] = await createPlayerContext(2)

			// Host creates room
			const roomId = await createRoom(player1, 'SameName')

			// Player 2 joins with the same name
			await joinRoom(player2, roomId, 'SameName')
			await verifyPlayerCount(player1, 2)
			await verifyPlayerCount(player2, 2)
		})

		test('Full game e2e', async ({ createPlayerContext }) => {
			const [player1, player2, player3, player4] = await createPlayerContext(4)
			const playerArr = [player1, player2, player3, player4]
			const playerNames = ['Player1', 'Player2', 'Player3', 'Player4']

			// Host creates room
			const roomId = await createRoom(player1, 'Player1')

			// Players join the room
			await joinRoom(player2, roomId, 'Player2')
			await joinRoom(player3, roomId, 'Player3')
			await joinRoom(player4, roomId, 'Player4')

			// Verify all players are in the room
			for (const player of playerArr) {
				expect(player.gamePage.infoBarRound).toContainText('1')
				await verifyPlayerCount(player, 4)
			}

			// All players click the ready button
			for (const player of playerArr) {
				await player.gamePage.readyButton.click()
			}

			// Verify answer grid is visible for all players
			for (const player of playerArr) {
				await expect(player.gamePage.answerGrid).toBeVisible()
			}

			// Count imposters and detectives
			let numberOfImposters = 0
			let numberOfDetectives = 0
			for (const player of playerArr) {
				if (await player.gamePage.imposterText.isVisible()) {
					numberOfImposters++
				}
				const highlightedItems = await player.gamePage.getHasHighlightedAnswer()
				// there should only be 0 or 1 highlighted items
				expect([0, 1]).toContain(highlightedItems)
				if (highlightedItems) {
					numberOfDetectives++
				}
			}
			expect(numberOfImposters).toBe(1)
			expect(numberOfDetectives).toBe(3)

			// All players click the ready to vote button
			for (const player of playerArr) {
				await player.gamePage.readyToVoteButton.click()
			}

			// Verify we're on the voting screen
			for (const player of playerArr) {
				if (await player.gamePage.votePanel.isHidden()) {
					await expect(player.gamePage.answerGrid).toBeVisible()
				}
			}

			// All players vote for the next player in the list
			for (let i = 0; i < playerArr.length; i++) {
				const player = playerArr[i]
				const playerToVoteFor = playerNames[(i + 1) % playerNames.length]

				// if the player is the imposter, they have to guess the answer
				if (await player.gamePage.answerGrid.isVisible()) {
					const answerButton = player.gamePage.answerGrid.getByRole('button').getByText('Titanic')

					// Verify the initial color is gray
					await expect(answerButton).toHaveCSS('background-color', 'rgb(243, 244, 246)')

					// Click the answer
					await answerButton.click()

					// Verify the color changes to green
					await expect(answerButton).toHaveCSS('background-color', 'rgb(220, 252, 231)')

					// Click the confirm button
					await player.gamePage.confirmButtonVotingScreen.click()
				}

				await voteForPlayer(player, playerToVoteFor)
			}

			for (const player of playerArr) {
				// verify the ui is in the correct state
				expect(player.gamePage.beginNextRoundButton).toBeVisible()
				expect(await player.gamePage.getNumberOfPlayerScoreItems()).toBe(4)
				expect(player.gamePage.imposterBadge).toBeVisible()
			}

			// All players click the begin next round button
			for (const player of playerArr) {
				await player.gamePage.beginNextRoundButton.click()
			}

			// new round has started
			for (const player of playerArr) {
				await expect(player.gamePage.answerGrid).toBeVisible()
				await expect(player.gamePage.readyButton).toBeVisible()
				expect(player.gamePage.infoBarRound).toContainText('2')
			}
		})

		test('Players cannot leave the game', async ({ createPlayerContext }) => {
			// create 4 players
			const [player1, player2, player3, player4] = await createPlayerContext(4)
			const playerArr = [player1, player2, player3, player4]
			// they all join the same room
			const roomId = await createRoom(player1, 'Player1')
			await joinRoom(player2, roomId, 'Player2')
			await joinRoom(player3, roomId, 'Player3')
			await joinRoom(player4, roomId, 'Player4')
			// they start the game
			for (const player of playerArr) {
				await player.gamePage.readyButton.click()
			}
			for (const player of playerArr) {
				await expect(player.gamePage.answerGrid).toBeVisible()
			}

			for (const player of playerArr) {
				await player.gamePage.readyToVoteButton.click()
			}
			for (const player of playerArr) {
				if (await player.gamePage.votePanel.isHidden()) {
					await expect(player.gamePage.answerGrid).toBeVisible()
				} else {
					expect(player.gamePage.votePanel).toBeVisible()
				}
			}
			// one player closes their browser
			await player1.page.close()
			// there are no errors, and their avatar is still in the game

			await player2.page.waitForTimeout(1000)
			await expect(player2.page.getByText('Player1')).toBeVisible()
		})
	})
})

async function createRoom(context: PlayerContext, name: string): Promise<string> {
	await context.homePage.goto()
	await context.homePage.createNewButton.click()
	await context.homePage.nameInput.fill(name)
	await context.homePage.createRoomFormButton.click()

	// Wait for redirect and verify
	await expect(context.gamePage.readyButton).toBeVisible()

	// Return the room ID for reuse
	return await context.gamePage.roomId.innerText()
}

async function joinRoom(context: PlayerContext, roomId: string, name: string) {
	await context.homePage.goto()
	await context.homePage.joinExistingButton.click()
	await context.homePage.roomIdInput.fill(roomId)
	await context.homePage.nameInput.fill(name)
	await context.homePage.joinRoomFormButton.click()

	// Wait for redirect and verify
	await expect(context.gamePage.readyButton).toBeVisible()
}

// Add a more robust way to verify player count with retry
async function verifyPlayerCount(context: PlayerContext, expectedCount: number, timeout = 2000) {
	// Use a retry mechanism instead of arbitrary timeout
	await expect(async () => {
		const count = await context.gamePage.getNumberOfWaitingPlayers()
		expect(count).toBe(expectedCount)
	}).toPass({ timeout })
}

async function voteForPlayer(context: PlayerContext, playerName: string) {
	expect(context.gamePage.playerVoteButtons.getByText(playerName)).toBeVisible()
	await context.gamePage.playerVoteButtons.getByText(playerName).click()
}
