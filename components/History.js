import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { Text, View } from 'react-native'
// Model
import { TimerData } from '../models/TimerData';

export default class History extends PureComponent {
  
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.instanceOf(TimerData)).isRequired,
  }
  
  render() {
    const { data } = this.props;
    return (
      data.map((item, index) => {
        return (
          <View key={index}>
            <Text>{item.alias}</Text>
            <Text>{TimerData.configureTime(item.second)}</Text>
            <Text>{item.date.toLocaleString()}</Text>
          </View>
        )
      })
    )
  }
}
