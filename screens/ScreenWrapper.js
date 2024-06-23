// ScreenWrapper.js
import React, { Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';

const ScreenWrapper = ({ Component, ...props }) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

export default ScreenWrapper;
