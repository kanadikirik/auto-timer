import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, AppState } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TimerData } from '../models/TimerData'
import { STATUS } from '../services/constants'
import { addToHistory } from '../services/HistoryService'
import { useAccelerometer } from '../services/hooks/useAccelerometer'
import useInterval from '../services/hooks/useInterval'
import { COLOR, deviceHeight, deviceWidth, STYLE } from '../services/style'
import History from './History'
import { Feather } from '@expo/vector-icons'
import { useInfoContext } from '../services/context/InfoContext'
import { useSettingsContext } from '../services/context/SettingsContext'
import { BACKGROUND_PREFERENCE_KEYS } from '../services/SettingsService'

export default function Timer() {
	const { createMessage } = useInfoContext()
	const { backgroundPreference, handleSettingsModal } = useSettingsContext()

	const [second, setSecond] = useState(0)
	const [isCounting, setIsCounting] = useState(false)
	const [isActivatedAtSet, setIsActivatedAtSet] = useState(false)
	const [historyVisible, setHistoryVisible] = useState(false)
	const [timerActivatedAt, setTimerActivatedAt] = useState(null)

	useEffect(() => {
		return () => {
			clearInterval(timer)
		}
	}, [])

	const isAppVisible = useMemo(
		() => AppState.currentState.match('active'),
		[AppState.currentState],
	)

	useEffect(() => {
		if (!isAppVisible && backgroundPreference === BACKGROUND_PREFERENCE_KEYS.STOP) {
			stopTimer()
		}
	}, [isAppVisible])

	const { z } = useAccelerometer()

	useEffect(() => {
		handleUpright(z)
	}, [z])

	const shouldStart = !isCounting && isAppVisible

	const handleUpright = z => {
		if (z > 0.9 || z < -0.9) {
			if (shouldStart) startTimer()
		} else stopTimer()
	}

	const timer = useInterval(() => {
		if (isCounting) {
			const activeDate = timerActivatedAt ? timerActivatedAt : null
			const now = moment()
			setSecond(activeDate ? now.diff(moment(activeDate), 'seconds') : second + 1)
		}
	}, 1000)

	const startTimer = () => {
		if (!isActivatedAtSet) {
			setTimerActivatedAt(new Date())
			setIsActivatedAtSet(true)
		}
		setIsCounting(true)
	}

	const stopTimer = () => {
		setTimerActivatedAt(null)
		setIsCounting(false)
	}

	const reset = () => {
		setTimerActivatedAt(null)
		setSecond(0)
	}

	const saveData = async () => {
		const timerData = new TimerData(second, new Date())
		addToHistory(timerData)
			.then(() => {
				createMessage('Timer data added to history successfullyy', STATUS.SUCCESS)
			})
			.catch(() =>
				createMessage('Error while adding timer data to history', STATUS.ERROR),
			)
	}

	return (
		<>
			<View>
				<View style={[isCounting ? styles.timerShadow : {}]}>
					<View style={[styles.timerContainer]}>
						<View
							style={[
								styles.timerInnerContainer,
								isCounting ? styles.timerActiveBorder : {},
							]}
						>
							<Text style={[styles.timeText, STYLE.WHITE]}>
								{TimerData.configureTime(second)}
							</Text>
						</View>
					</View>
				</View>

				<View
					style={{
						position: 'absolute',
						bottom: -deviceHeight * 0.05,
						width: deviceWidth,
						left: -deviceWidth * 0.05,
					}}
				>
					<Text style={[STYLE.WHITE, STYLE.TA_CENTER]}>
						{isCounting ? (
							<Text>
								Keep the phone <Text style={STYLE.BOLD}>upright</Text> for{' '}
								<Text style={STYLE.BOLD}>stop</Text> the timer
							</Text>
						) : (
							<Text>
								Put the phone to the <Text style={STYLE.BOLD}>straight</Text> surface for{' '}
								<Text style={STYLE.BOLD}>start</Text> the timer
							</Text>
						)}
					</Text>
				</View>
			</View>
			<View
				style={[
					styles.menu,
					STYLE.SPACE(deviceWidth, deviceHeight),
					{ width: deviceWidth },
				]}
			>
				<TouchableOpacity
					onPress={() => setHistoryVisible(!historyVisible)}
					style={styles.icon}
				>
					<Feather name="clock" size={28} style={[STYLE.BLUE]} />
				</TouchableOpacity>
				<TouchableOpacity onPress={saveData} style={styles.icon}>
					<Feather name="bookmark" size={28} style={[STYLE.GREEN]} />
				</TouchableOpacity>
				<TouchableOpacity onPress={reset} style={styles.icon}>
					<Feather name="trash" size={28} style={[STYLE.RED]} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => handleSettingsModal(true)} style={styles.icon}>
					<Feather name="settings" size={28} style={[STYLE.WHITE]} />
				</TouchableOpacity>
			</View>
			{historyVisible && <History close={() => setHistoryVisible(false)} />}
		</>
	)
}

const styles = StyleSheet.create({
	timeText: {
		fontSize: 45,
		textAlign: 'center',
	},
	timerShadow: {
		shadowColor: COLOR.PRIMARY,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: 50,
		elevation: 5,
		borderRadius: 1000,
	},
	timerContainer: {
		borderWidth: 40,
		borderColor: '#FFFFFF30',
		borderRadius: 1000,
		width: deviceWidth * 0.9,
		height: deviceWidth * 0.9,
	},
	timerActiveBorder: {
		borderWidth: 10,
		borderColor: COLOR.PRIMARY,
	},
	timerInnerContainer: {
		paddingHorizontal: deviceHeight * 0.025,
		width: deviceWidth * 0.9 - 80,
		height: deviceWidth * 0.9 - 80,
		borderRadius: 1000,
		alignItems: 'center',
		justifyContent: 'center',
	},
	menu: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	icon: {
		backgroundColor: `${COLOR.PRIMARY}50`,
		alignItems: 'center',
		justifyContent: 'center',
		padding: deviceWidth * 0.025,
		borderRadius: 10,
		shadowColor: COLOR.PRIMARY,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: 3,
		elevation: 5,
	},
})
