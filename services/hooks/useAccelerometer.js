import { Accelerometer } from 'expo-sensors'
import { useEffect, useState } from 'react'

export const useAccelerometer = onChange => {
	let subscription = null

	const [z, setZ] = useState(0)

	useEffect(() => {
		subscribe()
		return () => {
			unsubscribe()
		}
	}, [])

	const subscribe = () => {
		subscription = Accelerometer.addListener(accelerometerData => {
			setZ(accelerometerData.z)
		})
	}

	const unsubscribe = () => {
		subscription && subscription.remove()
		subscription = null
	}

	return { z }
}
