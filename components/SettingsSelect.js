import React, { useCallback, useState } from 'react'
import { Text, Pressable, StyleSheet, View } from 'react-native'
import { COLOR, deviceHeight, deviceWidth, STYLE } from '../services/style'
import { Modal, Portal } from 'react-native-paper'
export default function SettingsSelect({
	options = [],
	selectedValue = '',
	onChange = () => {},
}) {
	const [sheetVisible, setSheetVisible] = useState(false)

	// callbacks
	const handleSheetChanges = useCallback(index => {
		if (index === -1) {
			setSheetVisible(false)
		}
	}, [])

	const onSelect = val => {
		onChange(val)
		setSheetVisible(false)
	}

	const selectedOption = options.find(opt => opt.value === selectedValue)

	return (
		<>
			{selectedOption && (
				<Pressable
					onPress={() => setSheetVisible(!sheetVisible)}
					style={[styles.optionContainer, styles.selectedOptionContainer]}
				>
					<Text style={styles.selectedLabel}>{selectedOption.label}</Text>
				</Pressable>
			)}
			{sheetVisible && (
				<View
					style={{
						marginTop: deviceHeight * 0.01,
						backgroundColor: `#FFFFFF20`,
						paddingHorizontal: deviceWidth * 0.05,
						paddingVertical: deviceHeight * 0.02,
						borderRadius: 10,
					}}
				>
					{options.map((option, index) => {
						const selected = selectedValue === option.value
						const isLast = index === options.length - 1
						return (
							<Pressable
								style={[
									styles.optionContainer,
									isLast ? {} : { marginBottom: deviceHeight * 0.02 },
									selected ? styles.selectedOptionContainer : {},
								]}
								key={option.value}
								onPress={() => onSelect(option.value)}
							>
								<Text style={[styles.optionLabel, selected ? styles.selectedLabel : {}]}>
									{option.label}
								</Text>
							</Pressable>
						)
					})}
				</View>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	selectedOptionContainer: {
		backgroundColor: 'white',
	},
	optionContainer: {
		paddingHorizontal: deviceWidth * 0.05,
		paddingVertical: deviceHeight * 0.01,
		borderRadius: 10,
		borderColor: COLOR.PRIMARY,
		borderWidth: 1,
	},
	optionLabel: {
		fontSize: 16,
		color: COLOR.WHITE,
	},
	selectedContainer: {
		backgroundColor: `#FFFFFF20`,
		paddingHorizontal: deviceWidth * 0.05,
		paddingVertical: deviceHeight * 0.01,
		borderRadius: 10,
	},
	selectedLabel: {
		color: COLOR.PRIMARY,
		fontWeight: 'bold',
	},
})
