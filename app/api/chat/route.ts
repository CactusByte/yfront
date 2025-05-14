import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    console.log('Forwarding request to external API:', { question })

    const response = await fetch('https://yongui-01d85530a217.herokuapp.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('External API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`External API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log('External API response:', data)

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from external API')
    }

    // Transform the response to match our expected format
    return NextResponse.json({
      response: data.answer
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        response: 'I\'m having trouble connecting to my home planet. Please try again later! 📡👾',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
