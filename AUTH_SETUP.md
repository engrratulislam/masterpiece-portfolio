# Portfolio Authentication System Setup Guide

## Overview
This guide will help you set up the complete authentication system for your Next.js portfolio with MySQL database.

## ✅ Prerequisites
- MySQL database (local or remote)
- Node.js 18+ installed
- Database name: `next_portfolio`

## 🚀 Quick Setup (5 Steps)

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env.local` and update with your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=next_portfolio
DB_PORT=3306

# NextAuth Configuration
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

NODE_ENV=development
```

### Step 2: Install Dependencies
All dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### Step 3: Setup Database
Run the migration script to create all tables:
```bash
npm run db:setup
```

This will create:
- ✅ Users table (with default admin)
- ✅ Sessions table
- ✅ Rate limiting table
- ✅ Projects, Skills, Experience tables
- ✅ Testimonials, Contact messages tables
- ✅ Media library table

**Default Admin Credentials:**
- Email: `admin@portfolio.com`
- Password: `admin123`
- ⚠️ **CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN!**

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Access Admin Panel
Navigate to: `http://localhost:3000/admin/login`

Login with the default credentials and you'll be redirected to the dashboard!

## 🗂️ Project Structure

```
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Login page
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   │   │   └── page.tsx          # Dashboard home
│   │   │   └── layout.tsx            # Admin wrapper layout
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/    # NextAuth handlers
│   │       └── admin/
│   │           └── stats/            # Dashboard stats API
│   ├── lib/
│   │   ├── db.ts                     # MySQL singleton connection
│   │   └── auth.ts                   # NextAuth configuration
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   └── middleware.ts                 # Route protection
├── database/
│   └── schema.sql                    # Database schema
├── scripts/
│   └── migrate.ts                    # Migration script
└── .env.example                      # Environment template
```

## 🔒 Security Features

✅ **Password Hashing**: Bcrypt with 12 salt rounds  
✅ **Rate Limiting**: Max 5 login attempts per 15 minutes  
✅ **Session Management**: JWT-based with 24-hour expiry  
✅ **Route Protection**: Middleware guards all /admin routes  
✅ **CSRF Protection**: Built into NextAuth  
✅ **SQL Injection Protection**: Parameterized queries  
✅ **Low Memory Footprint**: Singleton pool pattern (max 5 connections)

## 🎨 Features Implemented

### Authentication
- ✅ Modern glassmorphic login page
- ✅ Email/password authentication
- ✅ Remember me functionality
- ✅ Show/hide password toggle
- ✅ Form validation
- ✅ Error handling with toast notifications
- ✅ Loading states

### Admin Dashboard
- ✅ Responsive sidebar navigation
- ✅ Statistics cards (Projects, Skills, Experience, Messages)
- ✅ Dark mode toggle
- ✅ User profile dropdown
- ✅ Notification bell
- ✅ Mobile-friendly menu
- ✅ Quick actions section
- ✅ System status monitor

### Database Schema
- ✅ Users table (single admin)
- ✅ Sessions table
- ✅ Rate limiting table
- ✅ Contact messages
- ✅ Projects with multiple images
- ✅ Skills with categories
- ✅ Work experience
- ✅ Testimonials
- ✅ Media library

## 🛠️ API Routes Available

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signin` | Login authentication |
| POST | `/api/auth/signout` | Logout user |
| GET | `/api/admin/stats` | Dashboard statistics |

Additional API routes can be added for CRUD operations on:
- Projects
- Skills
- Experience
- Testimonials
- Messages
- Media

## 📝 Common Tasks

### Change Admin Password
After first login, you should change the password:
```sql
-- Connect to your database
-- Generate new password hash using bcrypt (12 rounds)
-- Update the password
UPDATE users 
SET password_hash = 'your_new_bcrypt_hash' 
WHERE email = 'admin@portfolio.com';
```

Or create a password change API endpoint.

### Add Another Admin User
```sql
INSERT INTO users (email, password_hash, name, role, isActive)
VALUES (
  'newemail@example.com',
  '$2b$12$...', -- Generate bcrypt hash
  'New Admin',
  'admin',
  true
);
```

### Reset Rate Limit for IP
```sql
DELETE FROM rate_limits WHERE identifier = 'IP_ADDRESS';
```

## 🐛 Troubleshooting

### Connection Error
- Verify MySQL is running
- Check `.env.local` credentials
- Ensure `next_portfolio` database exists
- Check firewall settings

### "Too Many Connections" Error
- The system uses max 5 connections (perfect for shared hosting)
- Check for orphaned connections in MySQL
- Restart your app if needed

### Login Not Working
- Check browser console for errors
- Verify database credentials
- Ensure migration script ran successfully
- Check that user exists in database

### Middleware Redirect Loop
- Clear browser cookies
- Check NEXTAUTH_URL matches your domain
- Verify middleware.ts configuration

## 🚀 Deployment to Shared Hosting

### Step 1: Build for Production
```bash
npm run build
```

### Step 2: Locate Standalone Build
The build creates: `.next/standalone/`

### Step 3: Upload Files
Upload these folders to your server:
- `.next/standalone/*` (entire contents)
- `public/` → place in server root
- `.next/static/` → place inside `.next/standalone/.next/static/`

### Step 4: Set Environment Variables
In your hosting panel (cPanel, etc.), set:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `NODE_ENV=production`

### Step 5: Run Migration
SSH into your server and run:
```bash
node_modules/.bin/ts-node scripts/migrate.ts
```

### Step 6: Start Application
Follow your hosting provider's instructions to start the Node.js app.

## 📊 Performance Optimization

This system is optimized for 1GB RAM shared hosting:
- ✅ No heavy ORMs (Prisma/TypeORM avoided)
- ✅ Singleton connection pool pattern
- ✅ Max 5 concurrent database connections
- ✅ Standalone build mode
- ✅ Efficient SQL queries with indexes

## 🔗 Next Steps

1. **Customize Design**: Update colors in `globals.css` to match your brand
2. **Add CRUD Pages**: Create forms for managing projects, skills, etc.
3. **File Upload**: Implement image upload for media library
4. **Email Integration**: Add SMTP for contact form notifications
5. **Backup System**: Schedule automated database backups
6. **Analytics**: Add visitor tracking to dashboard

## 📚 Technologies Used

- **Next.js 16**: App Router, Server Actions
- **NextAuth v5**: Authentication
- **MySQL2**: Database driver
- **Bcrypt**: Password hashing
- **React Hot Toast**: Notifications
- **Lucide React**: Icons
- **Tailwind CSS 4**: Styling

## 💡 Support

If you encounter issues:
1. Check this README
2. Review the documentation in `/docs` folder
3. Check browser console for errors
4. Verify database connection

## ⚠️ Important Notes

1. **Change default password immediately**
2. **Keep NEXTAUTH_SECRET secure and random**
3. **Never commit .env.local to git**
4. **Backup database regularly**
5. **Use HTTPS in production**
6. **Monitor rate limit table for attacks**

---

**🎉 Your authentication system is ready to use!**

Login at `/admin/login` and start managing your portfolio.
