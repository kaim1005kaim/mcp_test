import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import ScanScreen from '../screens/nfc/ScanScreen';
import MeetSuccessScreen from '../screens/nfc/MeetSuccessScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddPersonScreen from '../screens/profile/AddPersonScreen';

export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  MeetSuccess: { personId: string };
  Profile: { personId: string };
  AddPerson: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF9500',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MeetChain' }} />
      <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'NFCスキャン' }} />
      <Stack.Screen name="MeetSuccess" component={MeetSuccessScreen} options={{ title: '会えたね！' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'プロフィール' }} />
      <Stack.Screen name="AddPerson" component={AddPersonScreen} options={{ title: '人を追加' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
