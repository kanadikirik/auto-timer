import AsyncStorage from '@react-native-async-storage/async-storage'

const SETTING_KEYS = {
	background: 'auto-timer-background-pref',
}

export const BACKGROUND_PREFERENCE_LIST = [
	{
		label: 'Stop the timer',
		value: 'stop',
	},
	{
		label: 'Keep active',
		value: 'keep',
	},
]

export const DEFAULT_BACKGROUND_PREFERENCE = BACKGROUND_PREFERENCE_LIST[1].value

const getSetting = settingKey => {
	return AsyncStorage.getItem(settingKey)
}

const changeSetting = (settingKey, val) => {
	return AsyncStorage.setItem(settingKey, val)
}

export const setBackgroundPreferenceSetting = val => {
	return changeSetting(SETTING_KEYS.background, val)
}

export const getBackgroundPreferenceSetting = () => {
	return getSetting(SETTING_KEYS.background)
}
