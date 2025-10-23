# Frontend Authentication Implementation

## ✅ What We've Implemented

### 1. **Supabase Client Setup** (`src/lib/supabase.ts`)
- Configured Supabase client with publishable key (safe for client-side)
- Enabled auto-refresh tokens, session persistence, and URL detection

### 2. **Auth Context** (`src/contexts/AuthContext.tsx`)
- Global authentication state management
- Functions: `signUp`, `signIn`, `signOut`
- Auto session recovery on page reload
- Real-time auth state listener

### 3. **Protected Routes** (`src/components/ProtectedRoute/ProtectedRoute.tsx`)
- Redirects unauthenticated users to login
- Shows loading spinner during auth check

### 4. **Updated Pages**
- **LoginPage**: Real authentication with email/password
- **SignupPage**: Creates Supabase auth user with metadata (username, name, surname, nationality, experience)
- **HomePage**: Protected route (requires authentication)
- **MatchPage**: Protected route

### 5. **API Client** (`src/api/client.ts`)
- Automatically includes JWT token in all requests
- Header: `Authorization: Bearer <access_token>`

### 6. **Navbar**
- Shows logged-in user's email
- Logout button

---

## 🔑 How It Works

### User Registration Flow:
1. User fills signup form
2. Frontend calls `signUp()` → Creates user in `auth.users` table
3. User metadata (username, name, surname, etc.) stored in `user_metadata`
4. **⚠️ IMPORTANT**: You need to create a Player record manually or via database trigger

### User Login Flow:
1. User enters email/password
2. Frontend calls `signIn()` → Supabase validates credentials
3. Supabase returns JWT access token + refresh token
4. Tokens stored in localStorage (automatic)
5. User redirected to `/home`

### Authenticated Requests:
1. User accesses protected page (e.g., `/home`)
2. API call fetches auth token from Supabase session
3. Token added to request header: `Authorization: Bearer <token>`
4. Backend validates token (YOU NEED TO IMPLEMENT THIS)

---

## 🚧 What's Still Missing

### Frontend:
- [ ] Link auth user to Player ID (after Player is created)
- [ ] Update HomePage to use authenticated player's ID instead of hardcoded `CURRENT_PLAYER_ID = 1`
- [ ] Error handling for expired tokens

### Backend (Your Task):
- [ ] Create database trigger to auto-create Player when auth user signs up
- [ ] Add JWT validation middleware
- [ ] Protect endpoints (validate token)
- [ ] Extract user ID from JWT
- [ ] Link Players table to auth.users via `user_id` column

---

## 🔐 Environment Variables

`.env` file contains:
```env
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your_publishable_key>
```

**Security Notes:**
- ✅ Publishable key is SAFE for client-side use
- ❌ NEVER expose service_role key on frontend
- ✅ Supabase uses Row Level Security (RLS) to protect data

---

## 🧪 Testing

1. Start backend: `cd backend && go run .`
2. Start frontend: `cd frontend && npm run dev`
3. Test signup at `/signup`
4. Test login at `/login`
5. Verify protected routes redirect when not authenticated
6. Check browser DevTools → Network → See `Authorization` header in API calls

---

## 📚 Next Steps

### For You (Backend):
1. **Add JWT validation middleware in Go**
2. **Create database trigger to auto-create Player on signup**
3. **Update Players table schema** to include `user_id` (UUID reference to auth.users)
4. **Protect endpoints** - validate JWT before processing requests

Want me to teach you how to do this? 🚀
