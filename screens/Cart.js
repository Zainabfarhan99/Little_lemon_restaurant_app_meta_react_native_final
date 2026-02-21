import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, SafeAreaView, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCart, updateCartQuantity, removeFromCart, clearCart, placeOrder } from '../database';
import { useAuth } from '../AuthContext';

export default function CartScreen({ navigation }) {
  const { user, setCartCount } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    const items = await getCart(user.id);
    setCartItems(items);
    const total = items.reduce((s, i) => s + i.quantity, 0);
    setCartCount(total);
  };

  const handleIncrease = async (item) => {
    await updateCartQuantity(item.id, item.quantity + 1);
    loadCart();
  };

  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      handleDelete(item);
    } else {
      await updateCartQuantity(item.id, item.quantity - 1);
      loadCart();
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Remove item',
      `Remove "${item.name}" from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFromCart(item.id);
            loadCart();
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    Alert.alert('Clear cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: async () => {
          await clearCart(user.id);
          loadCart();
        },
      },
    ]);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const orderId = await placeOrder(user.id, cartItems, total);
      await clearCart(user.id);
      setCartCount(0);
      setCartItems([]);
      Alert.alert(
        '🎉 Order Placed!',
        `Your order #${orderId} has been placed!\nTotal: $${total.toFixed(2)}\n\nEstimated delivery: 30-40 mins`,
        [
          { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
          { text: 'Back to Menu', onPress: () => navigation.navigate('Home') },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const grandTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemsTotal = cartItems.reduce((s, i) => s + i.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;

  const renderItem = ({ item }) => (
    <View style={styles.cartCard}>
      <Text style={styles.cartEmoji}>{item.emoji}</Text>
      <View style={styles.cartInfo}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        <Text style={styles.cartUnitPrice}>${item.price.toFixed(2)} each</Text>
      </View>
      <View style={styles.qtyControls}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => handleDecrease(item)}>
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNum}>{item.quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => handleIncrease(item)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
        <Text style={styles.deleteBtnText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        {cartItems.length > 0 ? (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {cartItems.length === 0 ? (
        /* ── EMPTY STATE ── */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious items from our menu!</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListHeaderComponent={
              <Text style={styles.cartSummaryText}>
                {itemsTotal} item{itemsTotal !== 1 ? 's' : ''} in your cart
              </Text>
            }
          />

          {/* ── ORDER SUMMARY ── */}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${grandTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${(grandTotal + deliveryFee).toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.orderBtn, loading && styles.orderBtnDisabled]}
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              <Text style={styles.orderBtnText}>
                {loading ? 'Placing order...' : '🚴 Place Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // HEADER
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#495E57', justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  clearText: { color: '#e74c3c', fontSize: 14, fontWeight: '600' },

  cartSummaryText: { padding: 16, color: '#888', fontSize: 13 },

  // CART CARD
  cartCard: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  cartEmoji: { fontSize: 40, marginRight: 12 },
  cartInfo: { flex: 1 },
  cartName: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 2 },
  cartPrice: { fontSize: 15, fontWeight: '700', color: '#495E57', marginBottom: 2 },
  cartUnitPrice: { fontSize: 11, color: '#999' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', marginRight: 12, gap: 8 },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#EDEFEE', justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#495E57', lineHeight: 22 },
  qtyNum: { fontSize: 16, fontWeight: '700', color: '#333', minWidth: 24, textAlign: 'center' },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 20 },

  sep: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },

  // EMPTY
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 28 },
  browseBtn: { backgroundColor: '#495E57', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 32 },
  browseBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // ORDER SUMMARY
  orderSummary: {
    borderTopWidth: 1, borderTopColor: '#eee',
    padding: 20, backgroundColor: '#fff',
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,
  },
  summaryLabel: { fontSize: 15, color: '#666' },
  summaryValue: { fontSize: 15, color: '#333', fontWeight: '600' },
  totalRow: {
    borderTopWidth: 1, borderTopColor: '#eee',
    paddingTop: 12, marginBottom: 16, marginTop: 4,
  },
  totalLabel: { fontSize: 18, fontWeight: '800', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#495E57' },
  orderBtn: {
    backgroundColor: '#F4CE14', borderRadius: 10,
    paddingVertical: 16, alignItems: 'center',
  },
  orderBtnDisabled: { backgroundColor: '#ccc' },
  orderBtnText: { fontSize: 17, fontWeight: '800', color: '#333' },
});
