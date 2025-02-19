import { test as base } from '@playwright/test'
import { GamePage } from './GamePage'
import { HomePage } from './HomePage'

interface ImposterFixtures {
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
})

export { expect } from '@playwright/test'
