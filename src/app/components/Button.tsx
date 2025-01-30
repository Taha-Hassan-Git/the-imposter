import classNames from 'classnames'
import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'disabled'
type ButtonBaseProps = {
	children: ReactNode
	className?: string
	disabled?: boolean
}

// Props specific to regular buttons
type RegularButtonProps = ButtonBaseProps & {
	variant?: ButtonVariant
	onClick?: (e: React.MouseEvent) => void
	preventDefault?: boolean
	type?: 'button'
}

// Props specific to submit buttons
type SubmitButtonProps = ButtonBaseProps & {
	type: 'submit'
}

// Union type for all possible button props
type ButtonProps = RegularButtonProps | SubmitButtonProps

// Base styles for all buttons
const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors'

// Variant-specific styles
const variantStyles: Record<ButtonVariant, string> = {
	primary: 'bg-gray-700 text-white hover:bg-gray-800',
	secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
	disabled: 'bg-gray-200 text-gray-400',
}

export function Button(props: ButtonProps) {
	// Common props for all button types
	const commonProps = {
		className: classNames(
			baseStyles,
			props.type === 'submit'
				? variantStyles.primary // Submit buttons are always primary
				: props.disabled
					? variantStyles.disabled
					: variantStyles[props.variant ?? 'secondary'],
			props.className
		),
		disabled: props.disabled,
	}

	// If it's a submit button, return early with submit-specific props
	if (props.type === 'submit') {
		return (
			<button type="submit" {...commonProps}>
				{props.children}
			</button>
		)
	}

	// For regular buttons, include click handling
	return (
		<button
			type="button"
			onClick={(e) => {
				if (props.preventDefault) {
					e.preventDefault()
				}
				props.onClick?.(e)
			}}
			{...commonProps}
		>
			{props.children}
		</button>
	)
}
