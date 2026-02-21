import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import { AuthContext } from './AuthContext';
import { initDatabase, getUserById } from './database';
import { getSession, clearSession } from './session';

import LandingScreen from './screens/Landing';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import HomeScreen from './screens/Home';
import CartScreen from './screens/Cart';
import OrdersScreen from './screens/Orders';
import ProfileScreen from './screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      await initDatabase();
      const userId = await getSession();
      if (userId) {
        const userData = await getUserById(userId);
        if (userData) setUser(userData);
      }
    } catch (e) {
      console.log('Bootstrap error:', e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
    setCartCount(0);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#495E57' }}>
        <ActivityIndicator size="large" color="#F4CE14" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, cartCount, setCartCount }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Orders" component={OrdersScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}