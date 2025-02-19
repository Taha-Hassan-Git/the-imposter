'use client'
import { useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { categoriesArray, Category } from '../../../game-logic/types'
import { generateRoomId } from '../utils/generateRoomId'
import { Button } from './Button'
import { Input } from './Input'
import { RedMessage } from './Message'
import { Panel } from './Panel'

export type GameFormData = { category: Category; roomId: RoomId; name: string }

type RoomId = string | null

const defaultGameFormData: GameFormData = {
	category: 'films',
	name: '',
	roomId: null,
}

const placeHolderRoomId = generateRoomId()

export default function NewGameForm() {
	const searchParams = useSearchParams()
	const errorMessage = searchParams.get('error')
	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(() => !!errorMessage)
	setTimeout(() => {
		setShowErrorMessage(false)
	}, 5000)
	const [gameFormData, setGameFormData] = useState<GameFormData>(defaultGameFormData)
	const [showJoinExisting, setShowJoinExisting] = useState<boolean | undefined>(undefined)
	const isSubmitDisabled = showJoinExisting
		? !gameFormData.roomId || !gameFormData.name
		: !gameFormData.name

	useEffect(() => {
		const roomId = searchParams.get('roomId')

		if (roomId) {
			setGameFormData((prev) => {
				return { ...prev, roomId }
			})
			setShowJoinExisting(true)
		}
	}, [searchParams])

	if (showJoinExisting === undefined) {
		return (
			<div className="w-full flex flex-col items-center">
				{
					//disappears after 5 seconds
					showErrorMessage && <RedMessage message={errorMessage || 'Something went wrong'} />
				}
				<Panel className="flex flex-col gap-5 mt-5">
					<Button
						variant="primary"
						onClick={() => {
							setShowJoinExisting(false)
						}}
					>
						Create new room
					</Button>
					<Button
						variant="primary"
						onClick={() => {
							setShowJoinExisting(true)
						}}
					>
						Join existing room
					</Button>
				</Panel>
			</div>
		)
	}
	return (
		<Panel className="!p-0 mt-5">
			<div className="flex w-full">
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
			<div className="p-8 flex flex-col gap-5 w-full">
				{showJoinExisting ? (
					<Input
						name={'roomId'}
						type={'text'}
						label={'Room Id:'}
						value={gameFormData.roomId}
						placeholder={placeHolderRoomId}
						handleChange={(e) => {
							setGameFormData((prev) => {
								return { ...prev, roomId: e.target.value }
							})
						}}
					/>
				) : (
					<SelectCategories gameFormData={gameFormData} setGameFormData={setGameFormData} />
				)}

				<Input
					name={'name'}
					type={'text'}
					label={'Your Name:'}
					placeholder={'...what is your name?'}
					value={gameFormData.name}
					handleChange={(e) => {
						setGameFormData((prev) => {
							return { ...prev, name: e.target.value }
						})
					}}
				/>

				<div className="self-center w-full">
					<Button
						disabled={isSubmitDisabled}
						className="disabled:bg-gray-300 disabled:text-gray-800 w-full"
						type="submit"
					>
						{showJoinExisting ? 'Join Room' : 'Create Room'}
					</Button>
				</div>
			</div>
		</Panel>
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
				{categoriesArray.map((category) => {
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
