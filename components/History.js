import React, { useEffect, useState } from 'react'
import { Text, View, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import Loading from './Loading'
import { TimerData } from '../models/TimerData'
import { getHistory, setHistory as setHistoryService } from '../services/HistoryService'
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import { deviceHeight, deviceWidth, STYLE } from '../services/style'
import { STATUS } from '../services/constants'

import { useInfoContext } from '../services/context/InfoContext'

export default function History({ close }) {
	const { createMessage } = useInfoContext()

	const [status, setStatus] = useState(STATUS.LOADING)
	const [history, setHistory] = useState([])

	useEffect(() => {
		load()
	}, [])

	const load = async () => {
		await loadHistory()
		setStatus(STATUS.NORMAL)
	}

	const loadHistory = async () => {
		await getHistory()
			.then(setHistory)
			.catch(() => createMessage('Error while loading history', STATUS.ERROR))
	}

	const removeFromHistory = async index => {
		setStatus(STATUS.LOADING)
		history.splice(index, 1)
		await setHistoryService([...history])
			.then(setHistory)
			.catch(() =>
				createMessage('Error while deleting timer data from history', STATUS.ERROR),
			)
		setStatus(STATUS.NORMAL)
	}

	const clearHistory = async () => {
		if (history.length !== 0) {
			setStatus(STATUS.LOADING)
			await setHistoryService([])
				.then(setHistory)
				.catch(() => createMessage('Error while clearing history', STATUS.ERROR))
			setStatus(STATUS.NORMAL)
		}
	}

	return (
		<Modal animationType="slide" transparent={false} style={{ margin: 0 }}>
			{status === STATUS.LOADING && <Loading />}
			<View style={[{ flex: 1 }, STYLE.BG_DARK, STYLE.SPACE(deviceWidth, deviceHeight)]}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: deviceHeight * 0.05,
					}}
				>
					<TouchableOpacity onPress={close}>
						<Feather name="arrow-left" style={STYLE.WHITE} size={24} />
					</TouchableOpacity>
					<Text style={[styles.headText, STYLE.WHITE]}>History</Text>
					<TouchableOpacity onPress={clearHistory}>
						<Text style={STYLE.WHITE}>Clear</Text>
					</TouchableOpacity>
				</View>
				<ScrollView style={[]}>
					{history.map((timerData, index) => {
						return (
							<View
								key={timerData.date + timerData.second}
								style={{
									marginBottom: 20,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<View>
									<Text
										style={[STYLE.WHITE, STYLE.BOLD, { fontSize: 20, marginBottom: 5 }]}
									>
										{TimerData.configureTime(timerData.second)}
									</Text>
									<Text style={STYLE.WHITE}>{moment(timerData.date).calendar()}</Text>
								</View>
								<TouchableOpacity
									style={[STYLE.BG_RED_SOFT, { padding: 5, borderRadius: 2.5 }]}
									onPress={() => removeFromHistory(index)}
								>
									<Feather name="trash" size={22} style={[STYLE.WHITE]} />
								</TouchableOpacity>
							</View>
						)
					})}
				</ScrollView>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	headText: {
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
	},
})
