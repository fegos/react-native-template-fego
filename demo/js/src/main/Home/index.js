import { View, Text } from 'react-native';
import { Style, Page, Const } from 'common';
import React from 'react';

export default class Home extends Page {
  render() {
    return (
      <View style={[Style.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Const.textColor }}>Home</Text>
      </View>
    );
  }
}
