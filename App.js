import React from 'react';
import { StyleSheet, Text, View, StatusBar, Switch } from 'react-native';
import { Accelerometer } from 'expo';

export default class App extends React.Component {
  state = {
    accelerometerData: {},
    second: 0,
    isTimerActive: false,
    isTimerAvailable: true,
  }

  componentDidMount() {
    this._subscribe();
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

  _unsubscribe = () => {
    this._stopTimer();
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  _configureTime = () => {
    let { second } = this.state;
    if(second < 60)
      return `${second} seconds`
    else if(second >= 60 && second < 3600)
      return `${Math.floor(second/60)} minutes ${second%60} seconds`
  }

  _handleTimerAvailable = () => {
    let { isTimerAvailable } = this.state;
    isTimerAvailable ? this._unsubscribe() : this._subscribe();
    this.setState({ isTimerAvailable: !isTimerAvailable });
  }

  render() {
    let { isTimerAvailable, isTimerActive } = this.state;

    if(isTimerAvailable){
      if(isTimerActive)
        this.informationMessage = "Keep the phone upright for stop the timer"
      else 
        this.informationMessage = "Put the phone to the straight surface for start the timer"
    } else {
      this.informationMessage = "Toggle the switch for make timer available"
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <Text style={styles.headText}>Auto Timer</Text>
          <Switch value={isTimerAvailable} onValueChange={this._handleTimerAvailable} style={styles.switch} />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{this._configureTime()}</Text>
          <Text>
            {this.informationMessage}
          </Text>
        </View>
        <Text>Created by ook0</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20
  },
  header: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between'
  },
  timeContainer:{
    textAlign: 'center',
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
  switch:{
    transform: [{scale: 1.3}]
  }
});