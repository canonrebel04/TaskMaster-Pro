# TaskMaster Pro

<p align="center">
  <img src="public/images/logo.png" alt="TaskMaster Pro Logo" width="200"/>
</p>

A comprehensive task management application built with Next.js, featuring a beautiful UI, real-time updates, and powerful organization tools.

## Features

- 📅 Interactive Calendar View
- 📊 Task Statistics and Analytics
- 🔄 Real-time Updates
- 🌙 Dark/Light Theme
- 🌐 Internationalization (i18n)
- 📱 Responsive Design
- 🔒 Secure Authentication

## Technology Stack

- **Frontend:**
  - Next.js 14
  - React 18
  - TypeScript
  - Material-UI
  - TailwindCSS
  - Framer Motion
  - Chart.js

- **Backend:**
  - Supabase (Database & Authentication)
  - Next.js API Routes

- **Tools & Libraries:**
  - next-intl (Internationalization)
  - react-dnd (Drag and Drop)
  - TipTap (Rich Text Editor)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git (v2.30.0 or higher)

## Git Setup

1. Configure Git with your credentials:
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

2. If you want to keep your email private on GitHub:
   - Visit https://github.com/settings/emails
   - Enable "Keep my email address private"
   - Use the provided no-reply email for git config:
```bash
git config --global user.email "your-no-reply-address@users.noreply.github.com"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taskmaster-pro.git
cd taskmaster-pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

1. Create a new project on [Supabase](https://supabase.com)

2. Run the following SQL commands in your Supabase SQL editor:

```sql
-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create task_categories junction table
CREATE TABLE task_categories (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, category_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only modify their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

1. Clean the build cache:
```bash
rm -rf .next
# or on Windows
rmdir /s /q .next
```

2. Create a production build:
```bash
npm run build
```

3. Start the production server:
```bash
npm run start
```

## Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com):

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Manual Deployment
For other hosting platforms:

1. Set up environment variables on your hosting platform
2. Configure build command: `npm run build`
3. Configure start command: `npm run start`
4. Set Node.js version to 18.x or higher

### Large File Handling
If you have large files (>50MB):

1. Install Git LFS:
```bash
# Windows (with Chocolatey)
choco install git-lfs

# macOS
brew install git-lfs
```

2. Initialize Git LFS:
```bash
git lfs install
git lfs track "*.pack"
git add .gitattributes
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                   # Next.js 14 app directory
│   ├── api/              # API routes
│   ├── (auth)/           # Authentication pages
│   └── dashboard/        # Dashboard pages
├── components/           # React components
├── contexts/            # React contexts
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization files
├── lib/                # Utility functions
└── types/              # TypeScript types
```

## Authentication Setup

1. Enable authentication in your Supabase project
2. Configure the following auth providers:
   - Email/Password
   - Google (optional)
   - GitHub (optional)

3. Update your authentication redirect URLs in Supabase:
   - `http://localhost:3000/auth/callback` (Development)
   - `https://your-production-url.com/auth/callback` (Production)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Build Issues
1. If you encounter build errors:
```bash
# Clear all caches
rm -rf .next
npm cache clean --force
# Reinstall dependencies
rm -rf node_modules
npm install
```

2. For TypeScript errors:
```bash
# Run type checking
npm run typecheck
```

### Git Issues
1. Email privacy restrictions:
   - Use the GitHub-provided no-reply email address
   - Or make your email public in GitHub settings

2. Large file errors:
   - Use Git LFS for large files
   - Or add large files to .gitignore

### Database Connection Issues
1. Check Supabase connection:
   - Verify credentials in .env.local
   - Check IP allowlist in Supabase dashboard
   - Verify RLS policies

## Support

For support:
- Open an issue on GitHub
- Email support@taskmasterpro.com
- Join our [Discord channel](https://discord.gg/taskmasterpro)
