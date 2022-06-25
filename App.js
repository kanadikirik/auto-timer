import React, { useEffect, useState } from 'react'
import {
	StyleSheet,
	View,
	StatusBar,
	Dimensions,
	SafeAreaView,
	Image,
} from 'react-native'
import { COLOR, STYLE } from './services/style'
import TimeSaver from './components/TimeSaver'
import { Provider as PaperProvider } from 'react-native-paper'
import Timer from './components/Timer'
import InfoProvider from './components/provider/InfoProvider'
import SettingsProvider from './components/provider/SettingsProvider'

const width = Dimensions.get('window').width

export default function App() {
	const [timeSaverVisible, setTimeSaverVisible] = useState(false)

	useEffect(() => {
		StatusBar.setHidden(true)
	}, [])

	return (
		<PaperProvider>
			<InfoProvider>
				<SettingsProvider>
					{timeSaverVisible && <TimeSaver />}
					<SafeAreaView style={[styles.container, STYLE.BG_DARK]}>
						<View style={styles.header}>
							<View style={styles.logo}>
								<Image
									source={require('./assets/icon.png')}
									width={width * 0.125}
									height={width * 0.125}
									style={[
										{ width: width * 0.125, height: width * 0.125, borderRadius: 10 },
									]}
								/>
							</View>
						</View>
						<Timer />
					</SafeAreaView>
				</SettingsProvider>
			</InfoProvider>
		</PaperProvider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	header: {
		width: width,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: width * 0.05,
	},
	logo: {
		shadowColor: COLOR.PRIMARY,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 1,
		shadowRadius: 50,
		elevation: 5,
	},
})
