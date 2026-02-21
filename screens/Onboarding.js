import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ onComplete }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNextEnabled = firstName.trim().length > 0 && isValidEmail(email);

  const validateAndProceed = async () => {
    let valid = true;
    if (!firstName.trim()) {
      setFirstNameError('Please enter your first name');
      valid = false;
    } else {
      setFirstNameError('');
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!valid) return;

    try {
      await AsyncStorage.setItem(
        'userProfile',
        JSON.stringify({
          firstName: firstName.trim(),
          lastName: '',
          email: email.trim(),
          phone: '',
          notifications: {
            orderStatuses: true,
            passwordChanges: true,
            specialOffers: true,
            newsletter: true,
          },
          avatar: null,
        })
      );
      onComplete();
    } catch (e) {
      console.log('Error saving profile:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🍋</Text>
          </View>
          <Text style={styles.logoText}>LITTLE LEMON</Text>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextArea}>
            <Text style={styles.heroTitle}>Little Lemon</Text>
            <Text style={styles.heroSubtitle}>Chicago</Text>
            <Text style={styles.heroDescription}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroImageEmoji}>🍽️</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Let's get to know you</Text>

          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={[styles.input, firstNameError ? styles.inputError : null]}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              if (text.trim()) setFirstNameError('');
            }}
            autoCapitalize="words"
          />
          {firstNameError ? (
            <Text style={styles.errorText}>{firstNameError}</Text>
          ) : null}

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Enter your email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (isValidEmail(text)) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.nextButton,
              !isNextEnabled && styles.nextButtonDisabled,
            ]}
            onPress={validateAndProceed}
            disabled={!isNextEnabled}
          >
            <Text
              style={[
                styles.nextButtonText,
                !isNextEnabled && styles.nextButtonTextDisabled,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoIcon: {
    marginRight: 8,
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 2,
  },
  heroBanner: {
    backgroundColor: '#495E57',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextArea: {
    flex: 1,
    marginRight: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4CE14',
    fontStyle: 'italic',
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  heroImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#3d524a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageEmoji: {
    fontSize: 48,
  },
  formContainer: {
    padding: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: '#495E57',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
});
