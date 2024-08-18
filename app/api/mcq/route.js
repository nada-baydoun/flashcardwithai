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
      Create 5 multiple-choice questions (MCQs) based on the following text. Each MCQ should be in a flashcard format with:
      1. Front: The question followed by three options labeled A, B, and C
      2. Back: The correct answer (just the letter) and a brief explanation
      Each question should be creative and unique, and all 5 questions should have different difficulty levels.
      The questions should be relevant to the text.
      Format the output as a JSON array of objects, each with 'front' and 'back' properties.
      In the 'front' property, ensure each option is on a new line and prefixed with A), B), or C).
      Ensure the output is valid JSON. Do not include any explanatory text, code block formatting, or markdown syntax.
      Text: ${text}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    let responseText = response.text()

    // Remove any potential code block formatting
    responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '')

    // Attempt to parse the JSON
    let mcqFlashcards
    try {
      mcqFlashcards = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      console.log('Raw response:', responseText)
      return NextResponse.json({ message: 'Invalid JSON response from AI model' }, { status: 500 })
    }

    // Validate the structure of the parsed JSON
    if (!Array.isArray(mcqFlashcards) || !mcqFlashcards.every(card => card.front && card.back)) {
      console.error('Invalid MCQ flashcard structure:', mcqFlashcards)
      return NextResponse.json({ message: 'Invalid MCQ flashcard structure from AI model' }, { status: 500 })
    }

    return NextResponse.json({ mcqFlashcards })
  } catch (error) {
    console.error('Error generating MCQ flashcards:', error)
    return NextResponse.json({ message: 'Error generating MCQ flashcards' }, { status: 500 })
  }
}