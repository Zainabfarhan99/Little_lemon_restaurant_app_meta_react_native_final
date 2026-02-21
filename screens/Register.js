import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { registerUser } from '../database';
import { saveSession } from '../session';
import { useAuth } from '../AuthContext';

export default function RegisterScreen({ navigation }) {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Valid email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const userId = await registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
      });
      await saveSession(userId);             // AsyncStorage
      const newUser = {
        id: userId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        avatar: null,
        notifyOrderStatuses: 1,
        notifyPasswordChanges: 1,
        notifySpecialOffers: 1,
        notifyNewsletter: 1,
      };
      setUser(newUser);                      // navigate to app
    } catch (err) {
      if (err.message?.includes('UNIQUE')) {
        Alert.alert('Account exists', 'An account with this email already exists. Please login instead.');
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormFilled = form.firstName && form.email && form.password && form.confirmPassword;

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us for delicious Mediterranean food</Text>

            <Field label="First Name *" error={errors.firstName}>
              <TextInput style={[styles.input, errors.firstName && styles.inputErr]}
                value={form.firstName} onChangeText={(v) => update('firstName', v)}
                placeholder="Enter first name" autoCapitalize="words" />
            </Field>

            <Field label="Last Name" error={errors.lastName}>
              <TextInput style={styles.input}
                value={form.lastName} onChangeText={(v) => update('lastName', v)}
                placeholder="Enter last name" autoCapitalize="words" />
            </Field>

            <Field label="Email *" error={errors.email}>
              <TextInput style={[styles.input, errors.email && styles.inputErr]}
                value={form.email} onChangeText={(v) => update('email', v)}
                placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
            </Field>

            <Field label="Phone Number" error={errors.phone}>
              <TextInput style={styles.input}
                value={form.phone} onChangeText={(v) => update('phone', v)}
                placeholder="(000) 000-0000" keyboardType="phone-pad" />
            </Field>

            <Field label="Password *" error={errors.password}>
              <TextInput style={[styles.input, errors.password && styles.inputErr]}
                value={form.password} onChangeText={(v) => update('password', v)}
                placeholder="Min. 6 characters" secureTextEntry />
            </Field>

            <Field label="Confirm Password *" error={errors.confirmPassword}>
              <TextInput style={[styles.input, errors.confirmPassword && styles.inputErr]}
                value={form.confirmPassword} onChangeText={(v) => update('confirmPassword', v)}
                placeholder="Re-enter password" secureTextEntry />
            </Field>

            <TouchableOpacity
              style={[styles.btn, !isFormFilled && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={!isFormFilled || loading}
            >
              <Text style={styles.btnText}>{loading ? 'Creating account...' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchLink}>
              <Text style={styles.switchText}>Already have an account? <Text style={styles.switchBold}>Login</Text></Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Field = ({ label, error, children }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    {children}
    {error ? <Text style={styles.errText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#495E57',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F4CE14', justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { fontSize: 20, fontWeight: '700', color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  container: { paddingBottom: 40 },
  formBox: { padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 28 },
  label: { fontSize: 13, color: '#555', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10,
    padding: 13, fontSize: 15, color: '#333', backgroundColor: '#fafafa',
  },
  inputErr: { borderColor: '#e74c3c' },
  errText: { color: '#e74c3c', fontSize: 12, marginTop: 4 },
  btn: {
    backgroundColor: '#495E57', borderRadius: 10,
    padding: 16, alignItems: 'center', marginTop: 10,
  },
  btnDisabled: { backgroundColor: '#aab5b2' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  switchLink: { alignItems: 'center', marginTop: 20 },
  switchText: { color: '#666', fontSize: 14 },
  switchBold: { color: '#495E57', fontWeight: '700' },
});
