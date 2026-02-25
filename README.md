# الحارة - Alhara App

A community marketplace mobile app built with React Native + Expo.

## Tech Stack

- **React Native** + **Expo** (v54, SDK 54)
- **Expo Router** (file-based navigation)
- **TypeScript**
- **NativeWind** (Tailwind CSS for React Native)
- **Supabase** (auth, database, storage)
- **TanStack Query** (server state)
- **Zustand** (client state)
- **Almarai** font (Arabic typography)

## Getting Started

### 1. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `scripts/supabase-schema.sql`
3. Copy your project URL and anon key

### 2. Set Environment Variables

Edit `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Seed Sample Data (Optional)

```bash
# Add your service_role key to .env first:
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
npm run seed
```

This creates 7 Arabic users and 24 posts with Unsplash images.

**Test Credentials:**
- `ahmed@example.com` / `Password123!`
- `fatima@example.com` / `Password123!`
- `mohammed@example.com` / `Password123!`
- *(and 4 more...)*

### 5. Run the App

```bash
npm start         # Expo Go
npm run ios       # iOS simulator
npm run android   # Android emulator
```

## Project Structure

```
app/
├── _layout.tsx          # Root layout (fonts, auth, RTL, React Query)
├── index.tsx            # Auth guard (redirects to feed or login)
├── (auth)/
│   ├── login.tsx        # Login screen
│   └── signup.tsx       # Signup screen
├── (main)/
│   ├── _layout.tsx      # Main layout (Header + Footer + Drawer)
│   ├── index.tsx        # Feed screen
│   ├── search.tsx       # Search screen
│   └── profile.tsx      # Own profile + saved posts
├── post/[id].tsx        # Post detail
└── user/[id].tsx        # User profile

components/
├── Header.tsx           # App header (logo + location + menu)
├── Footer.tsx           # Bottom nav (search + profile)
├── DrawerMenu.tsx       # Slide-out hamburger menu
├── PostCard.tsx         # Post card for feed
├── Badge.tsx            # Tag chip
└── Avatar.tsx           # User avatar

lib/
├── supabase.ts          # Supabase client
└── queryClient.ts       # TanStack Query client

context/
└── AuthContext.tsx      # Auth state + signIn/signUp/signOut

hooks/
├── usePosts.ts          # Post queries + saved toggle
└── useProfile.ts        # User profile query

scripts/
├── supabase-schema.sql  # Run in Supabase SQL editor
└── seed.ts              # Seed data script
```

## Design System

From Figma:
- **Primary blue** `#0e179d` — logo, icons, text
- **Accent purple** `#6e56cf` — post titles, prices
- **Button blue** `#1e40af` — primary buttons
- **Border** `#e5e5e5`
- **Muted** `#737373` — secondary text
- **Font** — Almarai (Arabic), RTL layout throughout

## Database Schema

See `scripts/supabase-schema.sql` for the full schema including RLS policies.

| Table | Description |
|---|---|
| `users` | User profiles linked to auth.users |
| `posts` | Community posts with images + tags |
| `saved_posts` | Bookmarked posts per user |
# alhara
