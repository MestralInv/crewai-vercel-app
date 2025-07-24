# CrewAI + Next.js Deployment Guide for Vercel

This guide will help you deploy your CrewAI agent system with a Next.js frontend to Vercel using GitHub integration.

## 🚨 Important Considerations

**Vercel Limitations for CrewAI:**
- **Function Timeout**: Hobby plan has 10s timeout, Pro plan has 60s timeout
- **Memory Limits**: 1024MB max for serverless functions
- **Cold Starts**: First request may be slow

**Recommended Deployment Strategies:**

### Option 1: Hybrid Deployment (Recommended)
- Deploy Next.js frontend on Vercel
- Deploy CrewAI backend on a separate service (Railway, Render, DigitalOcean)
- Use webhooks/polling for long-running tasks

### Option 2: Full Vercel Deployment (Limited)
- Use short-running CrewAI tasks only
- Implement job queuing for longer tasks
- Consider using Vercel Pro plan for better limits

### Option 3: Mock + External Service
- Deploy frontend with mock data on Vercel
- Gradually migrate to external CrewAI service

## 📁 Required Repository Structure

```
your-repo/
├── prototype/                 # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
├── my_crewai_project/        # Python backend
│   ├── main.py
│   ├── api_wrapper.py
│   ├── pyproject.toml
│   └── requirements.txt      # Add this file
├── vercel.json               # Vercel configuration
├── .env.example             # Environment variables template
└── README.md
```

## 🛠️ Setup Steps

### 1. Prepare Your Repository

#### A. Create requirements.txt for Python dependencies:

```bash
# Navigate to my_crewai_project directory
cd my_crewai_project

# Create requirements.txt
cat > requirements.txt << EOL
crewai>=0.150.0
python-dotenv>=1.0.0
groq>=0.30.0
EOL
```

#### B. Create environment variables template:

```bash
# In project root
cat > .env.example << EOL
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL_NAME=llama3-70b-8192

# Next.js Configuration
NODE_ENV=development
EOL
```

### 2. GitHub Repository Setup

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub.com
   - Create new repository
   - Push your code:
     ```bash
     git remote add origin https://github.com/yourusername/your-repo-name.git
     git branch -M main
     git push -u origin main
     ```

### 3. Vercel Deployment

#### A. Connect GitHub to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository

#### B. Configure Build Settings:

- **Framework Preset**: Next.js
- **Root Directory**: `prototype`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

#### C. Environment Variables:

In Vercel dashboard, add these environment variables:

```
GROQ_API_KEY=your_actual_groq_api_key
GROQ_MODEL_NAME=llama3-70b-8192
NODE_ENV=production
```

### 4. Update Frontend Integration

The frontend is already configured to call the API. Update the crew trigger component to use real API calls:

```typescript
// In prototype/components/crew-trigger.tsx
const triggerCrew = async (templateId?: string) => {
  try {
    const response = await fetch('/api/crew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: customCrew.goal || "AI implementation in the investment industry",
        crewType: templateId || 'content-marketing'
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      // Handle successful crew trigger
      console.log('Crew started:', result)
    }
  } catch (error) {
    console.error('Failed to trigger crew:', error)
  }
}
```

## 🔧 Alternative Deployment Options

### Option A: Separate Backend Deployment

If CrewAI doesn't work well on Vercel, deploy it separately:

1. **Deploy Backend on Railway/Render**:
   ```bash
   # Create a simple Flask API wrapper
   pip install flask flask-cors
   ```

2. **Update Frontend API Calls**:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
   
   const response = await fetch(`${API_BASE_URL}/api/crew`, {
     method: 'POST',
     // ... rest of the request
   })
   ```

### Option B: Use External Job Queue

For production, consider using:
- **Celery + Redis** for task queuing
- **Bull Queue** for Node.js
- **Vercel Edge Functions** for shorter tasks

## 🚀 Deployment Commands

```bash
# Development
cd prototype
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npx vercel

# Deploy with custom domain
npx vercel --prod
```

## 🔐 Security Considerations

1. **Never commit .env files**
2. **Use Vercel environment variables** for secrets
3. **Implement rate limiting** for API endpoints
4. **Add authentication** for production use

## 🐛 Troubleshooting

### Common Issues:

1. **Function Timeout**:
   - Reduce CrewAI task complexity
   - Use async job processing
   - Consider external deployment

2. **Import Errors**:
   - Check requirements.txt
   - Verify Python runtime version
   - Test locally first

3. **Environment Variables**:
   - Ensure all vars are set in Vercel
   - Check variable names match exactly
   - Redeploy after adding new vars

## 📊 Monitoring & Analytics

Add monitoring to track:
- API response times
- Success/failure rates
- User engagement
- Resource usage

## 🔄 CI/CD Pipeline

Your GitHub integration will automatically:
- Deploy on push to main branch
- Run build checks
- Deploy preview branches
- Rollback on failures

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Test CrewAI locally first
3. Consider the alternative deployment options
4. Use mock data during development

---

**Next Steps:**
1. Follow the setup steps above
2. Test locally before deploying
3. Start with mock data and gradually integrate CrewAI
4. Monitor performance and adjust as needed 