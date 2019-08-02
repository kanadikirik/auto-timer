import React, { Component } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
// Components
import Info from './components/Info';
import History from './components/History';
import Loading from './components/Loading';
// Constants && Service && Style
import { addToHistory } from './services/HistoryService';
import { TimerData } from './models/TimerData';
import { STATUS, PAGE } from './services/constants';
import { Feather } from '@expo/vector-icons';
import { STYLE } from './services/style';

export default class App extends Component {

  constructor(props){
    super(props)
    StatusBar.setHidden(true)
    this.info = React.createRef()
    this.width = Dimensions.get('window').width
    this.height = Dimensions.get('window').height
  }

  state = {
    status: STATUS.LOADING,
    darkMode: true,
    accelerometerData: {},
    second: 0,
    isTimerActive: false,
    isHistoryVisible: false,
    activePage: PAGE.TIMER
  }

  componentDidMount = async () => {
    await this._subscribe();
    this.setState({ status: STATUS.NORMAL })
    this.createMessage = this.info.current.createMessage
  }

  componentWillUnmount = () => {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this._handleUpright(accelerometerData.z);
    });
  }

  _handleUpright = (z) => {
    if(z > 0.9 || z < -0.9){
      if(!this.state.isTimerActive)
        this._startTimer();
    } 
    else this._stopTimer();
  }

  _startTimer = () => {
    this.timer = setInterval(() => {
      this.setState({ second: this.state.second+1 })
    },1000)
    this.setState({ isTimerActive: true });
  }

  _stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ isTimerActive: false });
  }

  _resetTimer = () => { this.setState({ second: 0 }) }

  _unsubscribe = () => {
    this._stopTimer();
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }
  
  _saveTimerData = async () => {
    const timerData = new TimerData(this.state.second, new Date())
    addToHistory(timerData).then(() => {
      this.createMessage("Timer data added to history successfullyy", STATUS.SUCCESS)        
    })
    .catch(() => this.createMessage("Error while adding timer data to history", STATUS.ERROR))
  }

  _handleDarkMode = () => this.setState({ darkMode: !this.state.darkMode })
  _handleHistoryVisible = () => this.setState({ isHistoryVisible: !this.state.isHistoryVisible })

  render() {
    let { status, darkMode, isTimerActive, second, isHistoryVisible } = this.state;

    if(status === STATUS.LOADING) return <Loading />

    return (
      <View style={[styles.container, darkMode ? STYLE.BG_DARK : STYLE.BG_WHITE]}>
        <Info ref={this.info} />
        <View style={[{ width: this.width, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: this.height*.05, paddingHorizontal: this.width*.05 }]}>
          <Text style={[styles.headText, darkMode ? STYLE.WHITE : STYLE.DARK]}>Auto Timer</Text>
          <TouchableOpacity onPress={this._handleDarkMode} style={[ darkMode ? STYLE.BG_WHITE : STYLE.BG_DARK, { paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5 } ]}>
            <Text style={[darkMode ? STYLE.DARK : STYLE.WHITE, STYLE.BOLD]}>{ darkMode ? "Light mode" : "Dark mode" }</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: this.height*.025 }}>
          <Text style={[styles.timeText, darkMode ? STYLE.WHITE : STYLE.DARK ]}>{TimerData.configureTime(second)}</Text>
          <Text style={[darkMode ? STYLE.WHITE : STYLE.DARK, STYLE.TA_CENTER]}>
            { 
              isTimerActive
              ? <Text>Keep the phone <Text style={STYLE.BOLD}>upright</Text> for <Text style={STYLE.BOLD}>stop</Text> the timer</Text>
              : <Text>Put the phone to the <Text style={STYLE.BOLD}>straight</Text> surface for <Text style={STYLE.BOLD}>start</Text> the timer</Text>
            }
          </Text>
        </View>
        <View style={[styles.menu, STYLE.SPACE(this.width, this.height), { width: this.width }]}>
          <TouchableOpacity onPress={this._handleHistoryVisible}>
            <Feather name="clock" size={28} style={[STYLE.BLUE, styles.iconLeft]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._saveTimerData}>
            <Feather name="bookmark" size={28} style={[STYLE.GREEN, styles.iconLeft]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._resetTimer}>
            <Feather name="trash" size={28} style={[STYLE.RED, styles.iconLeft]} />
          </TouchableOpacity>
        </View>
        
        { (isHistoryVisible && status === STATUS.NORMAL) && 
          <History 
            width            = {this.width} 
            height           = {this.height} 
            darkMode         = {darkMode} 
            createMessage    = {this.createMessage} 
            handleVisibility = { this._handleHistoryVisible }
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "space-between",
  },
  header: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between'
  },
  timeContainerIcons:{
    flexDirection:'row',
    paddingVertical: 20,
  },
  headText:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeText:{
    fontSize: 45,
    textAlign: 'center',
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around",
  },
  iconLeft  : { marginRight: 10 },
});