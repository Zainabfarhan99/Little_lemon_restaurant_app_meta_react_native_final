import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getOrders } from '../database';
import { useAuth } from '../AuthContext';

export default function OrdersScreen({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    const data = await getOrders(user.id);
    setOrders(data);
  };

  const renderOrder = ({ item }) => {
    const items = JSON.parse(item.items);
    const date = new Date(item.createdAt);
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>
              {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {items.map((i, idx) => (
            <View key={idx} style={styles.orderItem}>
              <Text style={styles.orderItemName}>• {i.name}</Text>
              <Text style={styles.orderItemDetail}>x{i.qty} — ${(i.price * i.qty).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>Total: ${item.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySub}>Place your first order from the menu!</Text>
          <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.menuBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 16, gap: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#495E57', justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },

  // ORDER CARD
  orderCard: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 4, elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderId: { fontSize: 17, fontWeight: '700', color: '#333' },
  orderDate: { fontSize: 12, color: '#888', marginTop: 2 },
  statusBadge: {
    backgroundColor: '#E8F5E9', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start',
  },
  statusText: { color: '#2e7d32', fontWeight: '700', fontSize: 13 },
  orderItems: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12, gap: 8 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between' },
  orderItemName: { fontSize: 14, color: '#333' },
  orderItemDetail: { fontSize: 14, color: '#666' },
  orderFooter: {
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    marginTop: 12, paddingTop: 12, alignItems: 'flex-end',
  },
  orderTotal: { fontSize: 17, fontWeight: '800', color: '#495E57' },

  // EMPTY
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  menuBtn: { backgroundColor: '#495E57', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 32 },
  menuBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
