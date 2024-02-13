import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screen/Home';
import Signup from './screen/Signup';
import Login from './screen/Login';
import DashBoard from './screen/DashBoard';
import { firebase } from './config';

const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isVerified, setIsVerified] = useState(false)

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [])

  if (initializing) return null;

  if (user && user.emailVerified) {
    return (
      <Stack.Navigator initialRouteName="DashBoard" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DashBoard" component={DashBoard} />
      </Stack.Navigator>
    )
  } else {
    return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} >
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    )
  }

}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>)
}

