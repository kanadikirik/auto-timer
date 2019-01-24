import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Accelerometer } from 'expo';

export default class App extends React.Component {
  state = {
    accelerometerData: {},
    second: 0,
    timerActive: false,
  }

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this._handleTimer(accelerometerData.z);
    });
  }

  _handleTimer = (z) => {
    if(z > 0.9){
      if(!this.state.timerActive)
        this._startTimer();
    } else 
        this._stopTimer();
  }

  _startTimer = () => {
    this.timer = setInterval(() => {
      this.setState({ second: this.state.second+1 })
    },1000)
    this.setState({ timerActive: true });
  }

  _stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ timerActive: false });
  }

  _unsubscribe = () => {
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

  render() {
    let { timerActive } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Text style={styles.headText}>Auto Timer</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{this._configureTime()}</Text>
          <Text>
            {timerActive ? 
              "Keep the phone upright for stop the timer"
            :
              "Put the phone to the straight surface for start the timer"
            }
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
  }
});