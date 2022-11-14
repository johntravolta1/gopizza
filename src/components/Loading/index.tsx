import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import theme from '../../theme';

import { styles } from './styles';

export function Loading() {
  return (
    <View style={styles.container}>
        <ActivityIndicator color={theme.COLORS.PRIMARY_800}></ActivityIndicator>
    </View>
  );
}