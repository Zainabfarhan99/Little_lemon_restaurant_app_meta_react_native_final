import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#495E57" />
      <ScrollView contentContainerStyle={styles.container}>

        {/* ── HERO BANNER ── */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🍋</Text>
          <Text style={styles.heroTitle}>Little Lemon</Text>
          <Text style={styles.heroCity}>Chicago</Text>
          <Text style={styles.heroDesc}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
          <View style={styles.heroDishRow}>
            <Text style={styles.dishEmoji}>🥗</Text>
            <Text style={styles.dishEmoji}>🍝</Text>
            <Text style={styles.dishEmoji}>🐟</Text>
            <Text style={styles.dishEmoji}>🍋</Text>
          </View>
        </View>

        {/* ── HIGHLIGHTS ── */}
        <View style={styles.highlights}>
          <Text style={styles.highlightsTitle}>Why Little Lemon?</Text>
          <View style={styles.highlightRow}>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightEmoji}>👨‍🍳</Text>
              <Text style={styles.highlightLabel}>Family Owned</Text>
              <Text style={styles.highlightDesc}>Recipes passed down through generations</Text>
            </View>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightEmoji}>🌿</Text>
              <Text style={styles.highlightLabel}>Fresh Ingredients</Text>
              <Text style={styles.highlightDesc}>Locally sourced produce every day</Text>
            </View>
          </View>
          <View style={styles.highlightRow}>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightEmoji}>🚴</Text>
              <Text style={styles.highlightLabel}>Fast Delivery</Text>
              <Text style={styles.highlightDesc}>Hot food at your door in 30 mins</Text>
            </View>
            <View style={styles.highlightCard}>
              <Text style={styles.highlightEmoji}>🏆</Text>
              <Text style={styles.highlightLabel}>Award Winning</Text>
              <Text style={styles.highlightDesc}>Best Mediterranean in Chicago 2024</Text>
            </View>
          </View>
        </View>

        {/* ── POPULAR ITEMS PREVIEW ── */}
        <View style={styles.popular}>
          <Text style={styles.popularTitle}>Popular Dishes</Text>
          {[
            { emoji: '🥗', name: 'Greek Salad', price: '$12.99' },
            { emoji: '🍝', name: 'Pasta', price: '$18.99' },
            { emoji: '🍋', name: 'Lemon Dessert', price: '$6.99' },
          ].map((item) => (
            <View key={item.name} style={styles.popularItem}>
              <Text style={styles.popularEmoji}>{item.emoji}</Text>
              <Text style={styles.popularName}>{item.name}</Text>
              <Text style={styles.popularPrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* ── CTA BUTTONS ── */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to order?</Text>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerBtnText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#495E57' },
  container: { paddingBottom: 40 },

  // HERO
  hero: {
    backgroundColor: '#495E57',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 36,
  },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroTitle: {
    fontSize: 42, fontWeight: '800', color: '#F4CE14',
    fontStyle: 'italic', textAlign: 'center',
  },
  heroCity: { fontSize: 22, color: '#fff', marginBottom: 16 },
  heroDesc: {
    fontSize: 15, color: '#eee', textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },
  heroDishRow: { flexDirection: 'row', gap: 16 },
  dishEmoji: { fontSize: 36 },

  // HIGHLIGHTS
  highlights: {
    backgroundColor: '#fff',
    padding: 24,
  },
  highlightsTitle: {
    fontSize: 22, fontWeight: '700', color: '#333',
    marginBottom: 16, textAlign: 'center',
  },
  highlightRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  highlightCard: {
    flex: 1, backgroundColor: '#F8F9FA', borderRadius: 12,
    padding: 16, alignItems: 'center',
  },
  highlightEmoji: { fontSize: 28, marginBottom: 6 },
  highlightLabel: { fontSize: 14, fontWeight: '700', color: '#333', textAlign: 'center' },
  highlightDesc: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 },

  // POPULAR
  popular: {
    backgroundColor: '#EDEFEE',
    padding: 24,
  },
  popularTitle: {
    fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 16,
  },
  popularItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    padding: 14, marginBottom: 10,
  },
  popularEmoji: { fontSize: 28, marginRight: 12 },
  popularName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  popularPrice: { fontSize: 16, fontWeight: '700', color: '#495E57' },

  // CTA
  ctaSection: {
    backgroundColor: '#fff', padding: 24, alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 20,
  },
  registerBtn: {
    backgroundColor: '#495E57', borderRadius: 10, paddingVertical: 16,
    paddingHorizontal: 40, width: '100%', alignItems: 'center', marginBottom: 12,
  },
  registerBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  loginBtn: {
    borderWidth: 2, borderColor: '#495E57', borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 40,
    width: '100%', alignItems: 'center',
  },
  loginBtnText: { color: '#495E57', fontSize: 17, fontWeight: '700' },
});
