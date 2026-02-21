import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MENU_ITEMS, CATEGORIES } from '../menuData';
import { addToCart, getCart } from '../database';
import { useAuth } from '../AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout, cartCount, setCartCount } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Refresh cart count whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshCartCount();
    }, [])
  );

  const refreshCartCount = async () => {
    const items = await getCart(user.id);
    const total = items.reduce((sum, i) => sum + i.quantity, 0);
    setCartCount(total);
  };

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchSearch = !search
      || item.name.toLowerCase().includes(search.toLowerCase())
      || item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleAddToCart = async (item) => {
    try {
      await addToCart(user.id, item);
      await refreshCartCount();
      Alert.alert('Added! 🛒', `${item.name} added to your cart.`, [
        { text: 'Keep browsing' },
        { text: 'View cart', onPress: () => navigation.navigate('Cart') },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not add item to cart.');
    }
  };

  const getInitials = () => {
    const f = user?.firstName?.[0] || '';
    const l = user?.lastName?.[0] || '';
    return (f + l).toUpperCase() || '?';
  };

  const renderItem = ({ item }) => (
    <View style={styles.menuCard}>
      <View style={styles.menuCardLeft}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuCategory}>{item.category}</Text>
        <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.menuCardRight}>
        <Text style={styles.menuEmoji}>{item.emoji}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Orders')} style={styles.ordersBtn}>
          <Text style={styles.ordersBtnText}>📦</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🍋 Little Lemon</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartBtnText}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <>
            {/* ── HERO ── */}
            <View style={styles.hero}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroTitle}>Little Lemon</Text>
                <Text style={styles.heroCity}>Chicago</Text>
                <Text style={styles.heroDesc}>
                  Family owned Mediterranean restaurant with traditional recipes and a modern twist.
                </Text>
              </View>
              <Text style={styles.heroImage}>🍽️</Text>
            </View>

            {/* ── SEARCH ── */}
            <View style={styles.searchWrap}>
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search menu..."
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor="#888"
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Text style={{ fontSize: 16, color: '#888' }}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* ── MENU BREAKDOWN ── */}
            <View style={styles.breakdown}>
              <Text style={styles.breakdownTitle}>ORDER FOR DELIVERY!</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
                    onPress={() => setActiveCategory(cat)}
                  >
                    <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.divider} />
            <Text style={styles.itemCount}>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // HEADER
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  ordersBtn: { padding: 6 },
  ordersBtnText: { fontSize: 24 },
  headerTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1, color: '#333' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartBtn: { padding: 6, position: 'relative' },
  cartBtnText: { fontSize: 24 },
  cartBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: '#F4CE14', borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center',
  },
  cartBadgeText: { fontSize: 10, fontWeight: '800', color: '#333' },
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#495E57', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // HERO
  hero: {
    backgroundColor: '#495E57', padding: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  heroLeft: { flex: 1, marginRight: 16 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#F4CE14', fontStyle: 'italic' },
  heroCity: { fontSize: 18, color: '#fff', marginBottom: 8 },
  heroDesc: { fontSize: 13, color: '#eee', lineHeight: 19 },
  heroImage: { fontSize: 64 },

  // SEARCH
  searchWrap: { backgroundColor: '#495E57', paddingHorizontal: 16, paddingBottom: 18 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  // CATEGORIES
  breakdown: { padding: 16 },
  breakdownTitle: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 14 },
  catRow: { flexDirection: 'row', gap: 8 },
  catBtn: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 20, backgroundColor: '#EDEFEE',
  },
  catBtnActive: { backgroundColor: '#F4CE14' },
  catText: { fontSize: 14, fontWeight: '600', color: '#495E57' },
  catTextActive: { color: '#333' },

  divider: { height: 1, backgroundColor: '#eee', marginHorizontal: 16, marginBottom: 4 },
  itemCount: { paddingHorizontal: 16, paddingVertical: 8, color: '#888', fontSize: 13 },

  // MENU CARDS
  menuCard: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14,
    alignItems: 'flex-start',
  },
  menuCardLeft: { flex: 1, marginRight: 12 },
  menuName: { fontSize: 17, fontWeight: '700', color: '#333', marginBottom: 2 },
  menuCategory: { fontSize: 11, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuDesc: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 8 },
  menuPrice: { fontSize: 16, fontWeight: '700', color: '#495E57' },
  menuCardRight: { alignItems: 'center', gap: 10 },
  menuEmoji: { fontSize: 48, marginBottom: 6 },
  addBtn: {
    backgroundColor: '#495E57', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },
  empty: { padding: 48, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 },
});