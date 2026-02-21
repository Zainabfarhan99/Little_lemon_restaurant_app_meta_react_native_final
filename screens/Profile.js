import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserById, updateUser } from '../database';
import { useAuth } from '../AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    notifyOrderStatuses: true, notifyPasswordChanges: true,
    notifySpecialOffers: true, notifyNewsletter: true,
  });
  const [originalForm, setOriginalForm] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  const loadUser = async () => {
    const u = await getUserById(user.id);
    if (u) {
      const data = {
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        phone: u.phone || '',
        notifyOrderStatuses: u.notifyOrderStatuses === 1,
        notifyPasswordChanges: u.notifyPasswordChanges === 1,
        notifySpecialOffers: u.notifySpecialOffers === 1,
        notifyNewsletter: u.notifyNewsletter === 1,
      };
      setForm(data);
      setOriginalForm(data);
      setHasChanges(false);
    }
  };

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!form.firstName.trim()) {
      Alert.alert('Error', 'First name cannot be empty.');
      return;
    }
    try {
      await updateUser(user.id, form);                  // SQLite update
      setUser((u) => ({ ...u, ...form }));
      setOriginalForm(form);
      setHasChanges(false);
      Alert.alert('Saved! ✅', 'Your profile has been updated.');
    } catch (e) {
      Alert.alert('Error', 'Could not save profile.');
    }
  };

  const handleDiscard = () => {
    if (originalForm) {
      setForm(originalForm);
      setHasChanges(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: logout,          // clears AsyncStorage + resets user state
      },
    ]);
  };

  const getInitials = () => {
    const f = form.firstName?.[0] || '';
    const l = form.lastName?.[0] || '';
    return (f + l).toUpperCase() || '?';
  };

  const CheckBox = ({ value, onToggle }) => (
    <TouchableOpacity
      style={[styles.checkbox, value && styles.checkboxChecked]}
      onPress={onToggle}
    >
      {value && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🍋 Little Lemon</Text>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>{getInitials()}</Text>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal information</Text>

            {/* Avatar */}
            <View style={styles.avatarRow}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>{getInitials()}</Text>
              </View>
              <Text style={styles.avatarHint}>Tap to change photo (coming soon)</Text>
            </View>

            {/* Fields */}
            {[
              { label: 'First name', field: 'firstName', keyboard: 'default', cap: 'words' },
              { label: 'Last name', field: 'lastName', keyboard: 'default', cap: 'words' },
              { label: 'Email', field: 'email', keyboard: 'email-address', cap: 'none' },
              { label: 'Phone number', field: 'phone', keyboard: 'phone-pad', cap: 'none' },
            ].map(({ label, field, keyboard, cap }) => (
              <View key={field}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={form[field]}
                  onChangeText={(v) => updateField(field, v)}
                  placeholder={label}
                  keyboardType={keyboard}
                  autoCapitalize={cap}
                />
              </View>
            ))}

            {/* Notifications */}
            <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Email notifications</Text>
            {[
              { key: 'notifyOrderStatuses', label: 'Order statuses' },
              { key: 'notifyPasswordChanges', label: 'Password changes' },
              { key: 'notifySpecialOffers', label: 'Special offers' },
              { key: 'notifyNewsletter', label: 'Newsletter' },
            ].map(({ key, label }) => (
              <View key={key} style={styles.notifRow}>
                <CheckBox
                  value={form[key]}
                  onToggle={() => updateField(key, !form[key])}
                />
                <Text style={styles.notifLabel}>{label}</Text>
              </View>
            ))}

            {/* Log out */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>

            {/* Save / Discard */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard} disabled={!hasChanges}>
                <Text style={[styles.discardText, !hasChanges && { opacity: 0.4 }]}>Discard changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, !hasChanges && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!hasChanges}
              >
                <Text style={styles.saveText}>Save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#495E57', justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1, color: '#333' },
  avatarSmall: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#495E57', justifyContent: 'center', alignItems: 'center',
  },
  avatarSmallText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  card: {
    margin: 16, padding: 20, backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1, borderColor: '#eee',
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 18 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#495E57', justifyContent: 'center',
    alignItems: 'center', marginRight: 16,
  },
  avatarLargeText: { color: '#fff', fontSize: 26, fontWeight: '700' },
  avatarHint: { flex: 1, fontSize: 13, color: '#999' },

  label: { fontSize: 13, color: '#666', fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10,
    padding: 13, fontSize: 15, color: '#333', backgroundColor: '#fafafa',
  },

  notifRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkbox: {
    width: 26, height: 26, borderRadius: 4, borderWidth: 2, borderColor: '#ccc',
    marginRight: 12, justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#495E57', borderColor: '#495E57' },
  checkmark: { color: '#fff', fontWeight: '700', fontSize: 14 },
  notifLabel: { fontSize: 15, color: '#333' },

  logoutBtn: {
    backgroundColor: '#F4CE14', borderRadius: 10,
    paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 12,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#333' },

  actionRow: { flexDirection: 'row', gap: 12 },
  discardBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#495E57',
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  discardText: { color: '#495E57', fontWeight: '600', fontSize: 15 },
  saveBtn: {
    flex: 1, backgroundColor: '#495E57',
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#aab5b2' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
