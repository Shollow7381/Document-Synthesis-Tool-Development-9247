# Complete Setup Instructions

## 1. Download/Create Project Files

### Option A: Create from scratch
1. Create a new folder on your computer (e.g., `document-synthesizer`)
2. Copy all the files from the QuestArtifact above into this folder
3. Maintain the exact folder structure shown

### Option B: If you have the project files
1. Extract/download the project files
2. Navigate to the project root directory

## 2. Install Dependencies

Open terminal/command prompt in your project folder and run:

```bash
npm install
```

## 3. Edit Supabase Configuration

1. Navigate to: `src/lib/supabase.js`
2. Replace these lines:

```javascript
// CHANGE THIS:
const SUPABASE_URL = 'https://your-project-id.supabase.co'  
const SUPABASE_ANON_KEY = 'your-anon-key-here'  

// TO YOUR ACTUAL VALUES:
const SUPABASE_URL = 'https://abcdefghijk.supabase.co'  // Your real URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...'  // Your real key
```

## 4. Set Up Database (in Supabase)

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Run this SQL:

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

-- Create policies for public access
CREATE POLICY "Allow all operations on documents" ON documents_shared_lib FOR ALL USING (true);
CREATE POLICY "Allow all operations on synthesized docs" ON synthesized_docs_shared_lib FOR ALL USING (true);
```

## 5. Run the Application

In your terminal, run:

```bash
npm run dev
```

## 6. Access Your App

Open your browser and go to: `http://localhost:5173`

## Folder Structure Reference

```
your-project/
├── src/
│   ├── lib/
│   │   └── supabase.js     ← EDIT THIS FILE
│   ├── components/
│   │   ├── Auth.jsx
│   │   ├── DocumentLibrary.jsx
│   │   └── ... (other components)
│   ├── context/
│   │   └── DocumentContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── index.html
├── vite.config.js
└── tailwind.config.js
```