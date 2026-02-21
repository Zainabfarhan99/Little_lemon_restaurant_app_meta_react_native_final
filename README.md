# 🍋 Little Lemon – React Native Restaurant App

A full-featured mobile food ordering app for **Little Lemon** Mediterranean restaurant in Chicago, built with **React Native + Expo**.

---

## ✅ Features Checklist

| Requirement | Status |
|---|---|
| Wireframe-based design | ✅ |
| Landing screen with restaurant info | ✅ |
| User Registration with form validation | ✅ |
| User Login with authentication | ✅ |
| Home screen: Header, Hero, Menu Breakdown, Food Menu List | ✅ |
| Search bar to filter menu items | ✅ |
| Selectable menu category filters | ✅ |
| Add to cart from menu | ✅ |
| Cart: update quantity, delete items, clear all | ✅ |
| Place orders with total calculation | ✅ |
| Order history screen | ✅ |
| Profile screen with editable personal info | ✅ |
| Email notification preferences | ✅ |
| Changes saved and persisted (SQLite) | ✅ |
| Log out clears session data | ✅ |
| Stack navigation with Back button | ✅ |
| SQLite for persistent data storage | ✅ |
| AsyncStorage for session management | ✅ |

---

## 📁 Project Structure

```
LittleLemon/
├── App.js                  # Navigation setup + session check
├── AuthContext.js          # Global auth context (no circular deps)
├── database.js             # SQLite database layer (users, cart, orders)
├── session.js              # AsyncStorage session management
├── menuData.js             # Static menu items and categories
├── screens/
│   ├── Landing.js          # Restaurant homepage with login/register CTAs
│   ├── Login.js            # User login screen
│   ├── Register.js         # User registration screen
│   ├── Home.js             # Menu with search and category filters
│   ├── Cart.js             # Cart management and order placement
│   ├── Orders.js           # Order history
│   └── Profile.js          # User profile management
├── assets/                 # App icons and images
├── package.json
├── app.json
└── babel.config.js
```

---

## 🗄️ Data Storage

| Storage | Usage |
|---|---|
| **SQLite** (`expo-sqlite`) | Users, cart items, order history — fully persistent across restarts |
| **AsyncStorage** | Session token (logged-in user ID) — fast auth check on app launch |

### SQLite Tables
- `users` — registration data, profile info, notification preferences
- `cart` — items per user with quantity (upserts on duplicate)
- `orders` — placed orders with item snapshot and total amount

---

## 📱 App Flow

```
Landing Screen
├── → Register → (SQLite INSERT + AsyncStorage session)
└── → Login    → (SQLite SELECT + AsyncStorage session)
         ↓
    Home / Menu Screen
    ├── Search items by name or description
    ├── Filter by category (Starters, Mains, Desserts, Drinks)
    ├── "+ Add" button → adds to SQLite cart
    ├── 🛒 Live cart badge with item count
    ├── 📦 View order history
    └── Avatar → Profile screen
         ↓
    Cart Screen
    ├── View all cart items
    ├── + / − quantity controls
    ├── 🗑️ Delete individual items
    ├── Clear all items
    └── Place Order → SQLite INSERT into orders → cart cleared
         ↓
    Orders Screen → Full order history from SQLite
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+): https://nodejs.org
- Expo Go app on your phone (iOS App Store or Google Play)

### Step 1: Clone the repo

```bash
git clone https://github.com/zainabfarhan99/Little_lemon_restaurant_app_meta_react_native_final.git
cd Little_lemon_restaurant_app_meta_react_native_final
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the app

```bash
npx expo start --clear
```

### Step 4: Run on your device

- **Phone:** Scan the QR code with **Expo Go**
- **iOS Simulator:** Press `i`
- **Android Emulator:** Press `a`

---

## 🎨 Design System

| Color | Hex | Usage |
|---|---|---|
| Primary Green | `#495E57` | Header, buttons, hero background |
| Highlight Yellow | `#F4CE14` | Restaurant name, logout button, order CTA |
| Light Gray | `#EDEFEE` | Category pill backgrounds |
| White | `#FFFFFF` | App background, cards |

---

## 💡 Future Developments

1. **Real dish images** — Replace emoji placeholders with actual photos via Expo Image Picker
2. **Avatar upload** — Allow users to set a profile photo
3. **Push notifications** — Real order status notifications
4. **Backend API** — Connect to a live menu and order management system
5. **Table reservations** — Add a booking screen
6. **Ratings & reviews** — Allow users to rate dishes after ordering
7. **Dark mode** — Support system dark mode via `useColorScheme`
8. **Accessibility** — Add `accessibilityLabel` props for screen readers
9. **Payment integration** — Add Stripe or Apple Pay checkout
10. **Search animations** — Animate search bar and filter transitions

---


