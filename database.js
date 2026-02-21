import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync('little_lemon.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      avatar TEXT DEFAULT NULL,
      notifyOrderStatuses INTEGER DEFAULT 1,
      notifyPasswordChanges INTEGER DEFAULT 1,
      notifySpecialOffers INTEGER DEFAULT 1,
      notifyNewsletter INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      menuItemId TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      emoji TEXT DEFAULT '',
      quantity INTEGER DEFAULT 1,
      UNIQUE(userId, menuItemId)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      totalAmount REAL NOT NULL,
      status TEXT DEFAULT 'Placed',
      items TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);
};

// AUTH
export const registerUser = async ({ firstName, lastName, email, password, phone }) => {
  const result = await db.runAsync(
    `INSERT INTO users (firstName, lastName, email, password, phone) VALUES (?, ?, ?, ?, ?);`,
    [firstName, lastName || '', email, password, phone || '']
  );
  return result.lastInsertRowId;
};

export const loginUser = async (email, password) => {
  return await db.getFirstAsync(
    `SELECT * FROM users WHERE email = ? AND password = ?;`,
    [email, password]
  );
};

export const getUserById = async (userId) => {
  return await db.getFirstAsync(`SELECT * FROM users WHERE id = ?;`, [userId]);
};

export const updateUser = async (userId, updates) => {
  const { firstName, lastName, email, phone, avatar,
    notifyOrderStatuses, notifyPasswordChanges, notifySpecialOffers, notifyNewsletter } = updates;
  await db.runAsync(
    `UPDATE users SET firstName=?, lastName=?, email=?, phone=?, avatar=?,
     notifyOrderStatuses=?, notifyPasswordChanges=?, notifySpecialOffers=?, notifyNewsletter=?
     WHERE id=?;`,
    [firstName, lastName, email, phone, avatar || null,
     notifyOrderStatuses ? 1 : 0, notifyPasswordChanges ? 1 : 0,
     notifySpecialOffers ? 1 : 0, notifyNewsletter ? 1 : 0, userId]
  );
};

// CART
export const getCart = async (userId) => {
  return await db.getAllAsync(`SELECT * FROM cart WHERE userId = ? ORDER BY id;`, [userId]);
};

export const addToCart = async (userId, item) => {
  await db.runAsync(
    `INSERT INTO cart (userId, menuItemId, name, price, emoji, quantity)
     VALUES (?, ?, ?, ?, ?, 1)
     ON CONFLICT(userId, menuItemId) DO UPDATE SET quantity = quantity + 1;`,
    [userId, item.id, item.name, item.price, item.emoji]
  );
};

export const updateCartQuantity = async (cartId, quantity) => {
  await db.runAsync(`UPDATE cart SET quantity = ? WHERE id = ?;`, [quantity, cartId]);
};

export const removeFromCart = async (cartId) => {
  await db.runAsync(`DELETE FROM cart WHERE id = ?;`, [cartId]);
};

export const clearCart = async (userId) => {
  await db.runAsync(`DELETE FROM cart WHERE userId = ?;`, [userId]);
};

// ORDERS
export const placeOrder = async (userId, cartItems, totalAmount) => {
  const itemsJson = JSON.stringify(
    cartItems.map((i) => ({ name: i.name, qty: i.quantity, price: i.price }))
  );
  const result = await db.runAsync(
    `INSERT INTO orders (userId, totalAmount, items) VALUES (?, ?, ?);`,
    [userId, totalAmount, itemsJson]
  );
  return result.lastInsertRowId;
};

export const getOrders = async (userId) => {
  return await db.getAllAsync(
    `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC;`, [userId]
  );
};
