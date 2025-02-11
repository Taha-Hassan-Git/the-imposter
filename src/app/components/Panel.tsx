import classNames from 'classnames'
interface PanelProps {
	children: React.ReactNode
	className?: string
}

export function Panel(props: PanelProps) {
	const styles = classNames('bg-white rounded-lg shadow-md p-8 w-full', props.className)

	return <div className={styles}>{props.children}</div>
}
