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
	page2: Page
	homePage: HomePage
	gamePage: GamePage
	homePage2: HomePage
	gamePage2: GamePage
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
			const page2 = await context.newPage()
			return {
				context,
				page2,
				page,
				homePage: new HomePage(page),
				gamePage: new GamePage(page),
				homePage2: new HomePage(page2),
				gamePage2: new GamePage(page2),
			}
		}

		await testUse(async (count: number) => {
			return Promise.all(Array.from({ length: count }, () => createPlayerContext()))
		})
	},
})

export { expect } from '@playwright/test'
