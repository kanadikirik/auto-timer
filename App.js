import React, { Component } from 'react'
import { StyleSheet, Text, View, StatusBar, Switch, TouchableOpacity, AsyncStorage } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo';

// Model
import { TimerData } from './models/TimerData';
// Components
import History from './components/History';

export default class App extends Component {
  state = {
    accelerometerData: {},
    second: 0,
    isTimerActive: false,
    isTimerAvailable: true,
    history: {
      isLoaded: false,
      data: [],
      error: false,
    }
  }

  componentDidMount = async () => {
    this._subscribe();
    this._loadHistory();
  }
  
  _loadHistory = async () => {
    let history  = this.state.history;
    const historyData = await TimerData.get();
    historyData ? history.data = historyData : history.error = true;
    history.isLoaded = true;
    this.setState({ history })
  }

  componentWillUnmount() {
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
    } else 
        this._stopTimer();
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

  _resetTimer = () => {
    this.setState({ second: 0 });
  }

  _unsubscribe = () => {
    this._stopTimer();
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  _handleTimerAvailable = () => {
    let { isTimerAvailable } = this.state;
    isTimerAvailable ? this._unsubscribe() : this._subscribe();
    this.setState({ isTimerAvailable: !isTimerAvailable });
  }

  _saveTimerData = async () => {
    const saveStatus = await TimerData.save(this.state.second, "ook0", new Date());
  }

  render() {
    let { isTimerAvailable, isTimerActive, second, history } = this.state;

    if(isTimerAvailable){
      if(isTimerActive)
        this.informationMessage = <Text>Keep the phone <Text style={styles.fwBold}>upright</Text> for <Text style={styles.fwBold}>stop</Text> the timer</Text>
      else 
        this.informationMessage = <Text>Put the phone to the <Text style={styles.fwBold}>straight</Text> surface for <Text style={styles.fwBold}>start</Text> the timer</Text>
    } else {
      this.informationMessage = <Text><Text style={styles.fwBold}>Toggle the switch</Text> for make timer available</Text>
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <Text style={styles.headText}>Auto Timer</Text>
          <Switch value={isTimerAvailable} onValueChange={this._handleTimerAvailable} style={styles.switch} />
        </View>
        <View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{TimerData.configureTime(second)}</Text>
            <View style={styles.timeContainerIcons}>
              <TouchableOpacity onPress={this._resetTimer} style={styles.iconLeft}>
                <Feather name="trash-2" size={32} style={styles.red} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._saveTimerData}>
                <Feather name="bookmark" size={32} style={styles.blue} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.timerInformation}>
            <Ionicons name="ios-information" size={32} style={[styles.iconLeft, styles.blue]} />
            <Text>{this.informationMessage}</Text>
          </View>
        </View>
        { 
          history.isLoaded 
          ? <History data={history.data} />
          : <Text>Loading</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between'
  },
  timeContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  timeContainerIcons:{
    flexDirection:'row',
    paddingVertical: 20,
  },
  headText:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'    
  },
  timeText:{
    fontSize: 22,
    textAlign: 'center'
  },
  timerInformation:{
    flexDirection:'row',
    alignItems:'center',
  },
  switch:{
    transform: [{scale: 1.3}]
  },
  iconLeft:{
    marginRight: 15,
  },
  fwBold:{
    fontWeight: 'bold',
  },
  red:{
    color: '#F24236',
  },
  blue:{
    color: '#3A86FF',
  }
});