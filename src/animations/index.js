const scaleTransition = {
	initial: {
		opacity: 0,
		scale: 0.9,
	},
	animate: {
		opacity: 1,
		scale: 1,
	},
	transition: {
		delay: 0.3,
		duration: 0.5,
		ease: [0, 0.7, 0.2, 1],
	},
}

export { scaleTransition }
