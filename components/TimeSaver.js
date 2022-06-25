import React, { useCallback, useMemo, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { COLOR, deviceHeight, deviceWidth, STYLE } from '../services/style'

export default function TimeSaver({ timerData }) {
	const bottomSheetRef = useRef(null)

	const snapPoints = useMemo(() => ['50%', '50%'], [])

	// callbacks
	const handleSheetChanges = useCallback(index => {
		console.log('handleSheetChanges', index)
	}, [])

	return (
		<View style={styles.container}>
			<BottomSheet
				ref={bottomSheetRef}
				index={1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				style={STYLE.BG_DARK}
				backgroundStyle={STYLE.BG_DARK}
				handleIndicatorStyle={{ backgroundColor: 'white' }}
			>
				<View style={styles.contentContainer}>
					<Text>Awesome 🎉</Text>
				</View>
			</BottomSheet>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
})
