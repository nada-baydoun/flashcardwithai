import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  const { text } = await request.json()

  if (!text) {
    return NextResponse.json({ message: 'Text is required' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
      Create 5 flashcards based on the following text. Each flashcard should have a 'front' and 'back' side.
      The 'front' should be a question or prompt, and the 'back' should be the answer or explanation.
      each question should be creative and unique, all 5 questions should have a different difficulty level, and the answers should be concise.
      it is prohibited to generate less than 5 questions, and the questions should be relevant to the text.
      Format the output as a JSON array of objects, each with 'front' and 'back' properties.
      Ensure the output is valid JSON. Do not include any explanatory text, code block formatting, or markdown syntax.
      Text: ${text}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    let responseText = response.text()

    // Remove any potential code block formatting
    responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '')

    // Attempt to parse the JSON
    let flashcards
    try {
      flashcards = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      console.log('Raw response:', responseText)
      return NextResponse.json({ message: 'Invalid JSON response from AI model' }, { status: 500 })
    }

    // Validate the structure of the parsed JSON
    if (!Array.isArray(flashcards) || !flashcards.every(card => card.front && card.back)) {
      console.error('Invalid flashcard structure:', flashcards)
      return NextResponse.json({ message: 'Invalid flashcard structure from AI model' }, { status: 500 })
    }

    return NextResponse.json({ flashcards })
  } catch (error) {
    console.error('Error generating flashcards:', error)
    return NextResponse.json({ message: 'Error generating flashcards' }, { status: 500 })
  }
}