import { HTMLInputTypeAttribute } from 'react'

interface InputProps {
	name: string
	type: HTMLInputTypeAttribute
	label: string
	placeholder: string
	value: string
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export function Input(props: InputProps) {
	return (
		<div>
			<label htmlFor={'name'}>{props.label}</label>
			<input
				name={'name'}
				id={'name'}
				type={props.type}
				value={props.value}
				onChange={props.handleChange}
				className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	)
}
