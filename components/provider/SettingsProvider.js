import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { SettingsContext } from '../../services/context/SettingsContext'
import {
	DEFAULT_BACKGROUND_PREFERENCE,
	getBackgroundPreferenceSetting,
	setBackgroundPreferenceSetting,
} from '../../services/SettingsService'
import Settings from '../Settings'

export default function SettingsProvider({ children }) {
	const [loading, setLoading] = useState(true)
	const [visible, setVisible] = useState(false)
	const [backgroundPreference, setBackgroundPreference] = useState(null)

	useEffect(() => {
		if (backgroundPreference && loading) {
			setLoading(false)
		}
	}, [backgroundPreference])

	useEffect(() => {
		getSettings()
	}, [])

	const getSettings = async () => {
		try {
			const background = await getBackgroundPreferenceSetting()
			setBackgroundPreference(background || DEFAULT_BACKGROUND_PREFERENCE)
		} catch (e) {
			console.log(e)
			Alert.alert('Unknown error occurred')
		}
	}

	const changeBackgroundPreference = val => {
		setBackgroundPreference(val)
		setBackgroundPreferenceSetting(val)
	}

	return (
		<SettingsContext.Provider
			value={{
				handleSettingsModal: setVisible,
				backgroundPreference,
				changeBackgroundPreference,
				loading,
			}}
		>
			{visible && <Settings />}
			{children}
		</SettingsContext.Provider>
	)
}
