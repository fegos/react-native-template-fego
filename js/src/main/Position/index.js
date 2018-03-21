import { View, Text } from 'react-native';
import { Style, Page, Const } from 'common';
import React from 'react';

export default class PositionPage extends Page {
  render() {
    return (
      <View style={[Style.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Const.textColor }}>Position</Text>
      </View>
    );
  }
}
