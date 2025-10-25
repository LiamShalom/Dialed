# Grit - Daily Habit Tracker

A beautiful, modern habit tracking app built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎯 **Habit Tracking**: Create and manage daily habits with simple, intuitive tracking
- 📊 **Analytics**: Visualize your progress with beautiful charts and streak calendars
- 🔔 **Smart Reminders**: Get personalized notifications to stay on track
- 🎨 **Customizable**: Choose from multiple themes and personalize your experience
- 🔒 **Privacy First**: Your data is secure and private. No ads, no tracking
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast**: Built with Next.js 15 and optimized for performance

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Row-Level Security)
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   
   # Optional: Stripe for premium features
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
   
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses the following main tables:

- **users**: User profiles and preferences
- **habits**: User habits with metadata
- **habit_logs**: Daily habit completion logs
- **subscriptions**: Premium subscription data

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── analytics/         # Analytics and charts
│   ├── settings/         # User settings
│   └── premium/          # Premium upgrade page
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   └── habits/           # Habit-specific components
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   ├── store.ts          # Zustand state management
│   ├── utils.ts          # Utility functions
│   └── database.types.ts # TypeScript types for database
└── middleware.ts         # Next.js middleware for auth
```

## Features Implementation

### ✅ Completed
- [x] Project setup with Next.js 15 + TypeScript
- [x] Tailwind CSS + shadcn/ui components
- [x] Supabase database schema
- [x] User authentication (signup/login)
- [x] Dashboard with habit tracking
- [x] Analytics page with charts
- [x] Settings page
- [x] Premium page
- [x] Responsive design
- [x] Dark/light theme support

### 🚧 In Progress
- [ ] Habit creation/editing forms
- [ ] Real-time habit logging
- [ ] Streak calculations
- [ ] Notification system
- [ ] Stripe integration
- [ ] Data export functionality

### 📋 Planned
- [ ] Mobile PWA support
- [ ] Offline functionality
- [ ] Social features
- [ ] AI habit suggestions
- [ ] Advanced analytics
- [ ] Widget mode

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and Supabase.