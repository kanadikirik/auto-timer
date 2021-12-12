import React, { Component } from 'react'
import { Text, View, Modal, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
// Components
import Loading from './Loading'
// Model
import { TimerData } from '../models/TimerData'
// Constants && Service && Style
import { getHistory, setHistory } from '../services/HistoryService'
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import { STYLE } from '../services/style'
import { STATUS } from '../services/constants'

export default class History extends Component {
	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		darkMode: PropTypes.bool.isRequired,
		handleVisibility: PropTypes.func.isRequired,
		createMessage: PropTypes.func.isRequired,
	}

	state = {
		status: STATUS.LOADING,
		history: [],
	}

	async componentDidMount() {
		await this._loadHistory()
		this.setState({ status: STATUS.NORMAL })
	}

	_loadHistory = async () => {
		const { createMessage } = this.props
		await getHistory()
			.then(async history => {
				await this.setState({ history })
			})
			.catch(() => createMessage('Error while loading history', STATUS.ERROR))
	}

	_removeFromHistory = async index => {
		await this.setState({ status: STATUS.LOADING })
		const { history } = this.state
		history.splice(index, 1)
		await setHistory(history)
			.then(async () => await this.setState({ history }))
			.catch(() =>
				this.props.createMessage(
					'Error while deleting timer data from history',
					STATUS.ERROR,
				),
			)
		this.setState({ status: STATUS.NORMAL })
	}

	_clearHistory = async () => {
		if (this.state.history.length !== 0) {
			await this.setState({ status: STATUS.LOADING })
			await setHistory([])
				.then(async () => this.setState({ history: [] }))
				.catch(() =>
					this.props.createMessage('Error while clearing history', STATUS.ERROR),
				)
			this.setState({ status: STATUS.NORMAL })
		}
	}

	render() {
		const { width, height, darkMode, handleVisibility } = this.props
		const { status, history } = this.state

		return (
			<Modal animationType="slide" transparent={false} style={{ margin: 0 }}>
				{status === STATUS.LOADING && <Loading />}
				<View
					style={[
						{ flex: 1 },
						darkMode ? STYLE.BG_DARK : STYLE.BG_WHITE,
						STYLE.SPACE(width, height),
					]}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: height * 0.05,
						}}
					>
						<TouchableOpacity onPress={handleVisibility}>
							<Feather
								name="arrow-left"
								style={darkMode ? STYLE.WHITE : STYLE.DARK}
								size={24}
							/>
						</TouchableOpacity>
						<Text style={[styles.headText, darkMode ? STYLE.WHITE : STYLE.DARK]}>
							History
						</Text>
						<TouchableOpacity onPress={this._clearHistory}>
							<Text style={darkMode ? STYLE.WHITE : STYLE.DARK}>Clear</Text>
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
											style={[
												darkMode ? STYLE.WHITE : STYLE.DARK,
												STYLE.BOLD,
												{ fontSize: 20, marginBottom: 5 },
											]}
										>
											{TimerData.configureTime(timerData.second)}
										</Text>
										<Text style={darkMode ? STYLE.WHITE : STYLE.DARK}>
											{moment(timerData.date).calendar()}
										</Text>
									</View>
									<TouchableOpacity
										style={[STYLE.BG_RED_SOFT, { padding: 5, borderRadius: 2.5 }]}
										onPress={() => this._removeFromHistory(index)}
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
}

const styles = StyleSheet.create({
	headText: {
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
	},
})
