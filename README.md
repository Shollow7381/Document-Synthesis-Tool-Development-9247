# Shared Document Synthesizer

A collaborative document synthesis platform that allows teams to share a common document library and generate AI-powered synthesized documents.

## 🚀 Quick Setup for Shared Team Library

### Step 1: Create Free Supabase Account
1. Go to [supabase.com](https://supabase.com) and sign up for free
2. Create a new project (name it "document-synthesizer")
3. Wait for the project to be ready (2-3 minutes)

### Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://abcdefgh.supabase.co`)
3. Copy your **anon/public key**

### Step 3: Configure the Application
1. Clone this repository
2. Open `src/lib/supabase.js`
3. Replace the placeholders with your actual credentials:
   ```javascript
   const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co'
   const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY-HERE'
   ```

### Step 4: Set Up Database Tables
Run this SQL in your Supabase SQL Editor:

```sql
-- Create documents table
CREATE TABLE documents_shared_lib (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  size INTEGER,
  content TEXT,
  tags TEXT[],
  summary TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT
);

-- Create synthesized documents table
CREATE TABLE synthesized_docs_shared_lib (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL,
  source_facts TEXT,
  source_documents JSONB,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Enable Row Level Security
ALTER TABLE documents_shared_lib ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthesized_docs_shared_lib ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (team sharing)
CREATE POLICY "Allow all operations on documents" ON documents_shared_lib FOR ALL USING (true);
CREATE POLICY "Allow all operations on synthesized docs" ON synthesized_docs_shared_lib FOR ALL USING (true);
```

### Step 5: Deploy to Free Hosting

#### Option A: Netlify (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy and share the URL with your team

#### Option B: Vercel
1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Auto-deploy on every push
4. Share the production URL

### Step 6: Share with Your Team
1. Send the deployed URL to your colleagues
2. Each person creates an account using their email
3. Everyone can now access the shared document library

## ✨ Features

### Shared Document Library
- **Team Collaboration**: Everyone accesses the same document pool
- **Real-time Updates**: Documents appear instantly for all users
- **User Attribution**: See who uploaded each document
- **Personal vs Team Views**: Distinguish your documents from team documents

### Authentication & Security
- **Email/Password Authentication**: Simple signup process
- **Secure Access**: Only authenticated users can access documents
- **User Profiles**: Track individual contributions

### Document Management
- **Upload & Share**: Drag-and-drop document uploads
- **Smart Tagging**: AI-powered tag generation
- **Search & Filter**: Find documents by name, content, or tags
- **Document Attribution**: See who contributed each document

### AI Synthesis
- **Collaborative Synthesis**: Use team documents for AI generation
- **Multiple Formats**: Reports, summaries, memos, presentations, articles
- **Source Tracking**: Clear attribution to source documents
- **Team Outputs**: All generated documents available to the team

## 🔧 Technical Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Netlify/Vercel (free tier)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Database

## 🌐 Deployment Options

### Free Hosting Platforms
1. **Netlify**: Best for React apps, automatic deployments
2. **Vercel**: Excellent performance, easy GitHub integration
3. **GitHub Pages**: Simple static hosting

### Custom Domain (Optional)
- Connect your own domain name
- Professional team URLs
- Branded experience

## 👥 Team Usage

### For Team Leaders
1. Set up the Supabase project
2. Deploy the application
3. Share the URL with team members
4. Monitor document contributions

### For Team Members
1. Visit the shared URL
2. Create account with work email
3. Upload and access team documents
4. Generate collaborative synthesis

## 🔒 Privacy & Security

- **Data Ownership**: Your team owns all data in your Supabase project
- **Secure Authentication**: Industry-standard auth practices
- **Access Control**: Only authenticated team members can access
- **Data Persistence**: Documents stored securely in the cloud

## 📞 Support

For setup help or questions:
1. Check the Supabase documentation
2. Review the application logs
3. Contact your team administrator

## 🚀 Advanced Features

### Custom Branding
- Update colors and logos in the code
- Customize team name and descriptions
- Add company-specific messaging

### Analytics
- Track document usage
- Monitor synthesis patterns
- Team collaboration insights

### Integrations
- Connect with existing document systems
- API access for custom workflows
- Export capabilities for external tools

---

**Ready to get started?** Follow the setup steps above and have your team collaborating on documents within minutes!