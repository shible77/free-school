import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screen/Home';
import Signup from './screen/Signup';
import Login from './screen/Login';
import DashBoard from './screen/DashBoard';
import { firebase } from './config';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [verified, setVerified] = useState(false)

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      if (subscriber) {
        subscriber();
      }
    };
  }, []);
  

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        user.getIdTokenResult()
          .then((idTokenResult) => {
            if (idTokenResult && idTokenResult.claims.email_verified) {
              setVerified(true);
            }
          })
          .catch((error) => {
            console.error("Error getting ID token result:", error);
          });
      }
      else{
        setVerified(false)
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? (
        verified ? (
          <DashBoard />
        ) : (
          <AuthStack />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
export default App;
