import { NextRequest, NextResponse } from 'next/server'

interface CrewRequest {
  topic: string
  crewType?: 'content-marketing' | 'data-analysis' | 'product-research'
  mode?: 'prototype' | 'full'
}

interface CrewResponse {
  success: boolean
  jobId?: string
  result?: string
  error?: string
  status: 'started' | 'completed' | 'error' | 'timeout'
  mode?: string
}

// In-memory job store (replace with Redis in production)
const runningJobs = new Map<string, any>()

export async function POST(request: NextRequest): Promise<NextResponse<CrewResponse>> {
  try {
    const { topic, crewType = 'content-marketing', mode = 'prototype' }: CrewRequest = await request.json()

    if (!topic) {
      return NextResponse.json({
        success: false,
        error: 'Topic is required',
        status: 'error'
      })
    }

    const jobId = `crew_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // Prototype mode: Use simplified CrewAI or mock response
    if (mode === 'prototype') {
      try {
        if (isDevelopment) {
          // Try to run simplified CrewAI locally
          const { exec } = require('child_process')
          const path = require('path')
          
          const result = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Operation timed out'))
            }, 45000) // 45 second timeout for prototype
            
            const pythonScript = path.join(process.cwd(), '..', 'my_crewai_project', 'simple_crew.py')
            const env = {
              ...process.env,
              GROQ_MODEL_NAME: 'llama3-8b-8192', // Faster model
              GROQ_API_KEY: process.env.GROQ_API_KEY
            }
            
                         exec(`python "${pythonScript}" "${topic}"`, { env }, (error: any, stdout: any, stderr: any) => {
               clearTimeout(timeout)
               if (error) {
                 reject(error)
                 return
               }
               resolve(stdout)
             })
          })

          return NextResponse.json({
            success: true,
            result: result as string,
            jobId,
            status: 'completed',
            mode: 'prototype'
          })
        } else {
          // Production: Return enhanced mock response for prototype
          const mockResult = generatePrototypeMockResponse(topic)
          
          return NextResponse.json({
            success: true,
            result: mockResult,
            jobId,
            status: 'completed',
            mode: 'prototype'
          })
        }
      } catch (error) {
        // If real execution fails, fall back to mock
        const mockResult = generatePrototypeMockResponse(topic)
        
        return NextResponse.json({
          success: true,
          result: mockResult,
          jobId,
          status: 'completed',
          mode: 'prototype_fallback'
        })
      }
    }
    
    // Full mode: Use external service or return error
    else {
      return NextResponse.json({
        success: false,
        error: 'Full mode requires external backend deployment. Please use prototype mode or deploy backend separately.',
        status: 'error'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Internal server error: ${error}`,
      status: 'error'
    })
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json({
      success: false,
      error: 'Job ID is required',
      status: 'error'
    })
  }

  const job = runningJobs.get(jobId)
  if (!job) {
    return NextResponse.json({
      success: false,
      error: 'Job not found',
      status: 'error'
    })
  }

  return NextResponse.json({
    success: true,
    jobId,
    status: job.status,
    result: job.result,
    topic: job.topic
  })
}

function generatePrototypeMockResponse(topic: string): string {
  return `# ${topic} - Analysis Report

## Executive Summary

Based on current market trends and industry analysis, ${topic.toLowerCase()} presents significant opportunities for strategic implementation. The landscape is rapidly evolving with technological advances creating new possibilities for competitive advantage.

## Key Insights

**Market Dynamics**: The current market shows strong adoption trends with early movers gaining substantial advantages. Industry leaders are investing heavily in infrastructure and talent acquisition to support implementation initiatives.

**Implementation Considerations**: Success factors include stakeholder buy-in, phased rollout strategies, and robust change management processes. Organizations should prioritize data quality, security frameworks, and employee training programs.

## Actionable Recommendations

1. **Immediate Actions**: Conduct stakeholder readiness assessment and establish cross-functional implementation team
2. **Short-term Strategy**: Develop pilot program with measurable KPIs and success metrics
3. **Long-term Vision**: Scale successful pilots across organization with continuous optimization

---
*This is a prototype demonstration. For full CrewAI analysis, deploy the backend service.*`
} 