import classNames from 'classnames'
interface PanelProps {
	children: React.ReactNode
	variant?: 'column' | null
	className?: string
}

export function Panel(props: PanelProps) {
	const baseStyles = 'bg-white rounded-lg shadow-md w-full'

	const variantStyles = props.variant === 'column' ? 'flex flex-col gap-5 items-center' : ''

	// Apply padding only if it's not being overridden in className
	const paddingStyle =
		props.className?.includes('!p-') || props.className?.includes('p-') ? '' : 'p-8'

	const styles = classNames(baseStyles, paddingStyle, variantStyles, props.className)

	return <div className={styles}>{props.children}</div>
}
