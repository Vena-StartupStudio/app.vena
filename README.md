# Vena Task Management System

A comprehensive task management application for wellness professionals to assign and track follow-up tasks with their clients.

## Features

- ✅ **Client Management**: Add, edit, and organize clients
- ✅ **Group Management**: Create client groups for bulk task assignment
- ✅ **Task Assignment**: Assign tasks to individual clients or groups
- ✅ **Status Tracking**: Track task completion with visual status badges
- ✅ **Email Notifications**: Automatic email notifications when task status changes
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Real-time Updates**: Live data synchronization with Supabase

## Email Integration

The system automatically sends email notifications to clients when task statuses are updated. The email system supports:

### Email Service Options

1. **Resend API (Recommended)**
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Add to `.env.local`: `RESEND_API_KEY=your_api_key_here`

2. **SMTP Configuration (Alternative)**
   - Configure SMTP settings in `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_EMAIL=noreply@vena.software
   ```

### Email Templates

The system sends beautifully formatted HTML emails with:
- Professional Vena branding
- Task details and descriptions
- Due dates and status information
- Status-specific messaging (completed, pending, missed, reminders)
- Responsive design for all devices

## Setup Instructions

### 1. Environment Configuration

Copy `.env.local` and configure:

```bash
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (choose one)
RESEND_API_KEY=your_resend_api_key
# OR SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@vena.software
```

### 2. Database Setup

The application uses Supabase with the following tables:
- `clients` - Client information
- `client_groups` - Client group definitions
- `group_members` - Group membership relationships
- `tasks` - Task templates
- `client_tasks` - Task assignments with status tracking

### 3. Supabase Functions

Deploy the email function:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy functions
supabase functions deploy send-task-email
```

### 4. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Sign In**: Use Google OAuth or email/password authentication
2. **Manage Clients**: Add clients and organize them into groups
3. **Create Tasks**: Assign tasks to clients or groups with due dates
4. **Track Progress**: Update task statuses and automatically notify clients via email
5. **Monitor Activity**: View task completion rates and client engagement

## Email Flow

When a task status is updated:

1. **Status Change** → User updates task status in the UI
2. **Database Update** → Task status is saved to Supabase
3. **Email Trigger** → System automatically sends email notification
4. **Client Notification** → Client receives formatted email with task details
5. **Status Confirmation** → Email status is logged in the system

## Support

For issues or questions:
- Check the browser console for error messages
- Verify email configuration in environment variables
- Ensure Supabase functions are properly deployed
- Check email service provider limits and settings

## License

This project is part of the Vena wellness platform ecosystem.
