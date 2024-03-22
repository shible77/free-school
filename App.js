import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screen/Home';
import Signup from './screen/Signup';
import Login from './screen/Login';
import DashBoard from './screen/DashBoard';
import About from './screen/About';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { firebase } from './config';


const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="About" component={About}/>
    </Stack.Navigator>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [verified, setVerified] = useState(false)
  const [storedData, setStoredData] = useState(null)
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const userData = JSON.parse(storedUser);
    
        if (!userData) {
          setStoredData(null);
        } else {
          await firebase
            .auth()
            .signInWithEmailAndPassword(userData.email, userData.password)
            .then(() => {
              // console.log('Login successful')
            })
            .catch((err) => {
              console.log('Error while sign in', err.message);
            });
    
          setStoredData(userData);
        }
      } catch (err) {
        console.log('Error getting user data', err.message);
      } finally {
        setLoading(false); // Set loading to false after all operations are complete
      }
    };
    
    getUser();
  }, [user])

  // useEffect(() => {

  // },[user])

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
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
      else {
        setVerified(false)
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (initializing || loading) return null;


  if (!storedData) {
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

  return (
    <NavigationContainer>
      {user ? (
        verified ? (
          <DashBoard />
        ) : (
          null
        )
      ) : (
        null
      )}
    </NavigationContainer>
  );
}
export default App;
