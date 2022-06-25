import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'

const useAppState = () => {
	const appState = useRef(AppState.currentState)
	const [isAppVisible, setIsAppVisible] = useState(true)

	useEffect(() => {
		const removeListener = AppState.addEventListener('change', handleChange)

		return () => removeListener()
	}, [])

	const handleChange = nextAppState => {
		if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
			setIsAppVisible(true)
		} else if (
			appState.current === 'active' &&
			nextAppState.match(/inactive|background/)
		) {
			setIsAppVisible(false)
		}

		appState.current = nextAppState
	}

	return { isAppVisible }
}

export default useAppState
