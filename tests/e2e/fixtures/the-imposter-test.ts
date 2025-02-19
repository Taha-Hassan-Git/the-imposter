import { test as base, BrowserContext, Page } from '@playwright/test'
import { GamePage } from './GamePage'
import { HomePage } from './HomePage'

interface ImposterFixtures {
	homePage: HomePage
	gamePage: GamePage
	createPlayerContext: (count: number) => Promise<PlayerContext[]>
}
export interface PlayerContext {
	context: BrowserContext
	page: Page
	homePage: HomePage
	gamePage: GamePage
}

export const test = base.extend<ImposterFixtures>({
	homePage: async ({ page }, testUse) => {
		testUse(new HomePage(page))
	},
	gamePage: async ({ page }, testUse) => {
		testUse(new GamePage(page))
	},
	createPlayerContext: async ({ browser }, testUse) => {
		const createPlayerContext = async (): Promise<PlayerContext> => {
			const context = await browser.newContext()
			const page = await context.newPage()
			return {
				context,
				page,
				homePage: new HomePage(page),
				gamePage: new GamePage(page),
			}
		}

		await testUse(async (count: number) => {
			return Promise.all(Array.from({ length: count }, () => createPlayerContext()))
		})
	},
})

export { expect } from '@playwright/test'
