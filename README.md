# News Feed App

A React Native News Feed application built with Expo and Supabase.

## Features

- 📰 News Feed with video support
- 💬 Comments system
- 👤 User profiles with editing
- 🔐 Authentication (Login/Signup)
- 📱 iOS and Android support
- 🎥 Video playback with controls
- 📤 Share functionality

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Backend**: Supabase (Authentication, Database, Storage)
- **Language**: TypeScript
- **Video**: expo-video

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn
- Expo CLI
- Supabase account

## Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project directory
cd news-feed-app

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup

#### Option A: Using Supabase Dashboard

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to **SQL Editor**
3. Run the contents of `supabase/schema.sql`
4. Go to **Storage** and create a bucket named `avatars` (if not created by SQL)
5. Copy your project URL and anon key from **Settings > API**

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Run the App

```bash
# Start Expo development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── (tabs)/             # Tab navigation
│   │   ├── _layout.tsx     # Tab layout
│   │   ├── index.tsx       # News feed
│   │   └── profile.tsx     # Profile screen
│   ├── auth/               # Auth screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── comments/           # Comments modal
│       └── [newsId].tsx
├── components/             # Reusable components
│   ├── NewsCard.tsx
│   ├── VideoPlayer.tsx
│   ├── CommentItem.tsx
│   ├── CommentInput.tsx
│   ├── ProfileHeader.tsx
│   ├── LoadingState.tsx
│   └── EmptyState.tsx
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useNews.ts
│   ├── useComments.ts
│   └── useProfile.ts
├── lib/                    # Utility libraries
│   ├── supabase.ts
│   ├── auth.ts
│   └── api.ts
├── types/                  # TypeScript types
│   └── database.ts
├── constants/              # App constants
│   └── colors.ts
├── utils/                  # Utility functions
│   └── dateUtils.ts
└── supabase/               # Database schema
    └── schema.sql
```

## Database Schema

### Tables

- **profiles**: User profile information
- **news**: News articles with media
- **comments**: User comments on news

### Security

Row Level Security (RLS) is enabled on all tables:
- Users can read all profiles
- Users can only update their own profile
- Authenticated users can read news
- Users can create, update, and delete their own comments

## Features

### News Feed
- Pull-to-refresh
- Infinite scrolling/pagination
- Video playback with controls
- Image loading with error handling

### Comments
- Real-time comment display
- Add new comments
- Edit own comments
- Delete own comments

### Profile
- View profile information
- Edit profile details
- Upload avatar image
- Sign out functionality

## Troubleshooting

### Common Issues

1. **Supabase connection errors**
   - Verify your `.env` file has correct credentials
   - Ensure RLS policies are properly configured

2. **Video not playing**
   - Check if video URL is valid
   - Ensure video format is supported

3. **Build errors**
   - Run `npm install` to ensure dependencies are installed
   - Clear cache: `npx expo start --clear`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@newsfeedapp.com or create an issue in the repository.
