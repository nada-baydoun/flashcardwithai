import { initializeChroma, addDocuments } from '../../lib/chroma-client'
import fs from 'fs/promises'
import path from 'path'

async function readRawDataFile() {
  const filePath = path.join(process.cwd(), 'rawdata.txt')
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const entries = fileContent.split('\n\n')
  
  const documents = []
  const ids = []

  for (const entry of entries) {
    const [idLine, documentLine] = entry.split('\n')
    if (idLine && documentLine) {
      const id = idLine.replace('ID: ', '').trim()
      const document = documentLine.replace('Document: ', '').trim()
      ids.push(id)
      documents.push(document)
    }
  }

  return { documents, ids }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await initializeChroma()
      const { documents, ids } = await readRawDataFile()
      await addDocuments(documents, ids)
      res.status(200).json({ message: 'Chroma initialized and documents added' })
    } catch (error) {
      console.error('Error initializing Chroma:', error)
      res.status(500).json({ message: 'Error initializing Chroma' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}