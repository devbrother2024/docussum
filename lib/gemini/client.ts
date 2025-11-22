import { GoogleGenAI } from '@google/genai'

// Initialize the Gemini client
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ''
})

export default genAI
