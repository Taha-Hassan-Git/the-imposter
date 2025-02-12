import classNames from 'classnames'
interface PanelProps {
	children: React.ReactNode
	variant?: 'column' | null
	className?: string
}

export function Panel(props: PanelProps) {
	const styles = classNames(
		'bg-white rounded-lg shadow-md p-8 w-full',
		props.variant === 'column' ? 'flex flex-col gap-5 items-center' : '',
		props.className
	)

	return <div className={styles}>{props.children}</div>
}
