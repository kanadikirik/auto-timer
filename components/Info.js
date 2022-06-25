import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { STATUS } from '../services/constants'
import { COLOR, deviceHeight, deviceWidth } from '../services/style'

export default function Info({ messages = [] }) {
	if (messages.length === 0) return null

	return (
		<View
			style={[styles.container, { width: deviceWidth, padding: deviceWidth * 0.025 }]}
		>
			{messages.map(message => {
				return (
					<View
						key={message.id + message.text + Math.random()}
						style={[
							styles.info,
							styles[message.status + 'Bg'],
							{
								paddingHorizontal: deviceHeight * 0.025,
								paddingVertical: deviceWidth * 0.05,
							},
						]}
					>
						{message.status === STATUS.NORMAL && (
							<Feather
								name="info"
								size={20}
								style={{ marginRight: 10 }}
								color={COLOR.BLUE}
							/>
						)}
						{message.status === STATUS.SUCCESS && (
							<Feather
								name="check-circle"
								size={20}
								style={{ marginRight: 10 }}
								color={COLOR.GREEN}
							/>
						)}
						{message.status === STATUS.ERROR && (
							<Feather
								name="alert-circle"
								size={20}
								style={{ marginRight: 10 }}
								color={COLOR.RED}
							/>
						)}
						<Text style={styles[message.status + 'Text']}>{message.text}</Text>
					</View>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: Dimensions.get('screen').height * 0.04,
		left: 0,
		zIndex: 999,
	},
	info: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 6,
		marginBottom: 10,
	},
	normalBg: { backgroundColor: COLOR.BLUE_SOFT },
	successBg: { backgroundColor: COLOR.GREEN_SOFT },
	errorBg: { backgroundColor: COLOR.RED_SOFT },
	normalText: { color: COLOR.BLUE },
	successText: { color: COLOR.GREEN },
	errorText: { color: COLOR.RED },
})
