'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { generatePlayerName } from '../utils/generatePlayerName'
import { Button } from './Button'
import { Input } from './Input'

export type GameFormData = { category: Category; roomId: RoomId; name: string }
export type Category = 'films' | 'animals' | 'countries' | 'sports'
type RoomId = string | null

const defaultGameFormData: GameFormData = {
	category: 'films',
	name: generatePlayerName(),
	roomId: null,
}

const categories: Array<Category> = ['films', 'animals', 'countries', 'sports']

export default function NewGameForm() {
	const [gameFormData, setGameFormData] = useState<GameFormData>(defaultGameFormData)
	const [showJoinExisting, setShowJoinExisting] = useState<boolean | undefined>(undefined)
	if (showJoinExisting === undefined) {
		return (
			<div className="flex flex-col gap-5 bg-white rounded-lg shadow-md p-8 mt-5 w-full max-w-[500px]">
				<Button
					variant="secondary"
					onClick={() => {
						setShowJoinExisting(false)
					}}
				>
					Create new room
				</Button>
				<Button
					variant="secondary"
					onClick={() => {
						setShowJoinExisting(true)
					}}
				>
					Join existing room
				</Button>
			</div>
		)
	}
	return (
		<div className="flex flex-col gap-5 bg-white rounded-lg shadow-md mt-5 w-full max-w-[500px]">
			<div className="flex mt-0 w-full">
				<Button
					variant={showJoinExisting ? 'secondary' : 'disabled'}
					className="flex-1 px-2 rounded-tl-md rounded-r-none rounded-none bg-gray-100 disabled:bg-white disabled:text-gray-800"
					disabled={showJoinExisting}
					onClick={() => setShowJoinExisting(true)}
				>
					Join existing room
				</Button>
				<Button
					variant={!showJoinExisting ? 'secondary' : 'disabled'}
					className="flex-1 px-2 rounded-tr-md rounded-l-none rounded-none bg-gray-100 disabled:bg-white disabled:text-gray-800"
					disabled={!showJoinExisting}
					onClick={() => setShowJoinExisting(false)}
				>
					Create new room
				</Button>
			</div>
			<div className="p-8 flex flex-col gap-5">
				{!showJoinExisting && (
					<SelectCategories gameFormData={gameFormData} setGameFormData={setGameFormData} />
				)}
				<Input
					name={'name'}
					type={'text'}
					label={'Your Name:'}
					value={gameFormData.name}
					handleChange={(e) => {
						setGameFormData((prev) => {
							return { ...prev, name: e.target.value }
						})
					}}
				/>
				{showJoinExisting && (
					<Input
						name={'roomId'}
						type={'text'}
						label={'Room Id:'}
						value={gameFormData.roomId}
						handleChange={(e) => {
							setGameFormData((prev) => {
								return { ...prev, roomId: e.target.value }
							})
						}}
					/>
				)}
				<div className="self-center">
					<Button type="submit">{showJoinExisting ? 'Join Room' : 'Create Room'}</Button>
				</div>
			</div>
		</div>
	)
}

function SelectCategories({
	gameFormData,
	setGameFormData,
}: {
	gameFormData: GameFormData
	setGameFormData: Dispatch<SetStateAction<GameFormData>>
}) {
	return (
		<div className="flex-col">
			<label htmlFor="category" className="block mb-1 font-medium">
				Category:
			</label>
			<select
				value={gameFormData.category}
				onChange={(e) => {
					setGameFormData((prev) => {
						return { ...prev, category: e.target.value as Category }
					})
				}}
				id="category"
				name="category"
				className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{categories.map((category) => {
					return (
						<option key={category + 'option'} value={category}>
							{category.slice(0, 1).toUpperCase() + category.slice(1)}
						</option>
					)
				})}
			</select>
		</div>
	)
}
