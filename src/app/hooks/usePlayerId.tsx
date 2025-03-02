import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const PLAYER_ID_KEY = 'playerId'

export function usePlayerId() {
	const [playerId, setPlayerId] = useState<string | null>(null)

	useEffect(() => {
		// Check for existing player ID in sessionStorage
		const existingPlayerId = localStorage.getItem(PLAYER_ID_KEY)

		if (existingPlayerId) {
			setPlayerId(existingPlayerId)
		} else {
			// Generate new player ID if none exists
			const newPlayerId = uuidv4()
			localStorage.setItem(PLAYER_ID_KEY, newPlayerId)
			setPlayerId(newPlayerId)
		}
	}, [])

	return playerId as string
}
