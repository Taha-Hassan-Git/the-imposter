import classNames from 'classnames'

export function Pill({
	children,
	bgColor = 'gray',
	className,
}: {
	children: React.ReactNode
	bgColor?: string
	className?: string
}) {
	const bgColorStyle = `bg-${bgColor}-50 `

	const styles = classNames(
		'flex items-center justify-center border rounded-full px-3 py-1',
		bgColorStyle,
		className
	)
	return <div className={styles}>{children}</div>
}
