import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, Alert, ScrollView,
} from 'react-native';
import { loginUser } from '../database';
import { saveSession } from '../session';
import { useAuth } from '../AuthContext';

export default function LoginScreen({ navigation }) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await loginUser(email.trim().toLowerCase(), password);  // SQLite query
      if (user) {
        await saveSession(user.id);   // AsyncStorage session
        setUser(user);                // navigate to app
      } else {
        Alert.alert('Login failed', 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>🍋 Little Lemon</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.formBox}>
            {/* Big lemon icon */}
            <Text style={styles.bigEmoji}>🍋</Text>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Login to order your favourite dishes</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.btn, (!email || !password) && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={!email || !password || loading}
            >
              <Text style={styles.btnText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.switchLink}>
              <Text style={styles.switchText}>
                Don't have an account? <Text style={styles.switchBold}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#495E57',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F4CE14', justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { fontSize: 20, fontWeight: '700', color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  container: { flexGrow: 1 },
  formBox: { flex: 1, padding: 28, paddingTop: 48, alignItems: 'stretch' },
  bigEmoji: { fontSize: 56, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 30, fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 36 },
  label: { fontSize: 13, color: '#555', fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10,
    padding: 14, fontSize: 15, color: '#333', backgroundColor: '#fafafa',
  },
  btn: {
    backgroundColor: '#495E57', borderRadius: 10,
    padding: 16, alignItems: 'center', marginTop: 28,
  },
  btnDisabled: { backgroundColor: '#aab5b2' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  switchLink: { alignItems: 'center', marginTop: 24 },
  switchText: { color: '#666', fontSize: 14 },
  switchBold: { color: '#495E57', fontWeight: '700' },
});