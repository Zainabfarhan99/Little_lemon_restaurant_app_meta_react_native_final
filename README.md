# 🍋 Little Lemon – React Native Capstone App

A mobile restaurant app for **Little Lemon** restaurant in Chicago, built with **React Native + Expo**.

---

## ✅ Features Checklist

| Requirement | Status |
|---|---|
| Wireframe-based design | ✅ |
| Onboarding screen with personal details form | ✅ |
| Next button only enabled when fields are valid | ✅ |
| Home screen: Header, Hero, Menu Breakdown, Food Menu List | ✅ |
| Profile screen populated with onboarding data | ✅ |
| Changes saved and persisted (AsyncStorage) | ✅ |
| Log out clears all profile data | ✅ |
| Stack navigation with Back button | ✅ |
| Hero section with description + search bar | ✅ |
| Selectable menu category filters | ✅ |
| Food menu list with name, description, price, image | ✅ |

---

## 📁 Project Structure

```
LittleLemon/
├── App.js                  # Navigation setup + onboarding check
├── screens/
│   ├── Onboarding.js       # First-time user registration
│   ├── Home.js             # Main screen with menu
│   └── Profile.js          # User profile management
├── package.json
├── app.json
└── babel.config.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+): https://nodejs.org
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS App Store or Google Play)
  — OR —
- iOS Simulator (Mac only, requires Xcode)
- Android Emulator (requires Android Studio)

### Step 1: Install Dependencies

```bash
cd LittleLemon
npm install
```

### Step 2: Start the Development Server

```bash
npx expo start
```

This opens the **Expo Developer Tools** in your browser.

### Step 3: Run the App

**On your phone:**
- Scan the QR code in terminal with **Expo Go** (Android) or your Camera app (iOS)

**On simulator:**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator

---

## 📱 App Flow

1. **First launch** → Onboarding screen appears
2. Enter first name + valid email → **Next** button enables
3. Tap Next → saved to AsyncStorage → Home screen loads
4. **Home screen**: Browse menu, search items, filter by category
5. Tap profile avatar (top right) → **Profile screen**
6. Edit details, toggle notifications, **Save changes**
7. Data persists across app restarts
8. **Log out** → clears AsyncStorage → Onboarding screen reappears
9. **Back button** (←) returns to Home from Profile

---

## 🎨 Design System

| Color | Hex | Usage |
|---|---|---|
| Primary Green | `#495E57` | Header, buttons, hero background |
| Highlight Yellow | `#F4CE14` | Restaurant name, logout button |
| Light Gray | `#EDEFEE` | Category pill backgrounds |
| White | `#FFFFFF` | App background, cards |

---

## 💡 Potential Improvements

1. **Real images** – Replace emoji placeholders with actual dish photos using Expo Image Picker
2. **Cart functionality** – Add "Add to cart" on menu items with a checkout flow  
3. **Search animations** – Animate the search bar expanding when tapped
4. **Backend integration** – Connect to a real API for live menu data
5. **Order history** – Track past orders in Profile screen
6. **Reservations** – Add a table booking screen
7. **Ratings & reviews** – Allow users to rate dishes
8. **Dark mode** – Support system dark mode via `useColorScheme`
9. **Accessibility** – Add proper `accessibilityLabel` props for screen readers
10. **Push notifications** – Implement actual order status push notifications

---

## 🧪 Testing the Peer Review Criteria

| Question | How to Test |
|---|---|
| Wireframe exists? | See screenshots provided in submission |
| Onboarding on first open? | Clear app data / fresh install |
| Next button disabled without input? | Leave fields empty |
| Home screen layout correct? | Launch app after onboarding |
| Profile populated from onboarding? | Tap avatar on Home screen |
| Changes persist after restart? | Save changes → close → reopen app |
| Log out clears data? | Tap Log out → confirm → reopens onboarding |
| Back button works? | Tap ← on Profile screen |
| Hero has description + search? | Scroll Home screen |
| Category filters work? | Tap Starters, Mains, Desserts, Drinks |
| Menu shows name/price/description? | Scroll food list |
