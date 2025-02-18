import { Panel } from './Panel'

export function YellowMessage({ message }: { message: string }) {
	return (
		<Panel className="!bg-yellow-50 border-2 border-yellow-200 max-w-[90%] mt-4">{message}</Panel>
	)
}

export function RedMessage({ message }: { message: string }) {
	return <Panel className="!bg-red-50 border-2 border-red-200 max-w-[90%] mt-4">{message}</Panel>
}

export function GreenMessage({ message }: { message: string }) {
	return (
		<Panel className="!bg-green-50 border-2 border-green-200 max-w-[90%] mt-4">{message}</Panel>
	)
}
