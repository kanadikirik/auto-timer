import React, { useCallback, useMemo, useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { COLOR, deviceHeight, deviceWidth, STYLE } from '../services/style'
import BottomSheet from '@gorhom/bottom-sheet'
import SettingsSelect from './SettingsSelect'
import { BACKGROUND_PREFERENCE_LIST } from '../services/SettingsService'
import { useSettingsContext } from '../services/context/SettingsContext'
import { NativeViewGestureHandler } from 'react-native-gesture-handler'

export default function Settings() {
	const {
		loading,
		handleSettingsModal,
		backgroundPreference,
		changeBackgroundPreference,
	} = useSettingsContext()

	const close = () => handleSettingsModal(false)

	const bottomSheetRef = useRef(null)
	const snapPoints = useMemo(() => ['70%', '70%'], [])

	const handleSheetChanges = useCallback(index => {
		if (index === -1) {
			close()
		}
	}, [])

	return (
		<NativeViewGestureHandler disallowInterruption>
			<View style={{ ...styles.container }}>
				<View style={{ width: deviceWidth, height: deviceHeight, position: 'relative' }}>
					<BottomSheet
						key="settings"
						enablePanDownToClose
						ref={bottomSheetRef}
						index={1}
						snapPoints={snapPoints}
						onChange={handleSheetChanges}
						style={STYLE.BG_DARK}
						backgroundStyle={STYLE.BG_DARK}
						handleIndicatorStyle={{ backgroundColor: 'white' }}
					>
						<View
							style={{
								paddingHorizontal: deviceWidth * 0.05,
								paddingVertical: deviceHeight * 0.01,
							}}
						>
							<Text style={styles.title}>Settings</Text>
							{loading ? (
								<ActivityIndicator color={COLOR.WHITE} />
							) : (
								<>
									<Text style={styles.label}>App is Background Preferences</Text>
									<Text style={styles.desc}>
										What do you want to do if the timer is active and you switch to
										another app or closed the app
									</Text>
									<SettingsSelect
										options={BACKGROUND_PREFERENCE_LIST}
										selectedValue={backgroundPreference}
										onChange={changeBackgroundPreference}
									/>
								</>
							)}
						</View>
					</BottomSheet>
				</View>
			</View>
		</NativeViewGestureHandler>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		position: 'absolute',
		left: 0,
		bottom: 0,
		zIndex: 1,
		width: deviceWidth,
		height: deviceHeight,
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		zIndex: 2,
		...STYLE.BG_DARK,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		color: 'white',
		fontWeight: '800',
		textAlign: 'center',
	},
	label: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 10,
	},
	desc: {
		color: 'rgba(255, 255, 255, .7)',
		marginBottom: deviceHeight * 0.025,
	},
})
