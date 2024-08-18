import { NextResponse } from 'next/server'
import { ChromaClient } from 'chromadb'
import fs from 'fs/promises'
import path from 'path'

const chromaClient = new ChromaClient()

let collection

async function initializeChromaCollection() {
  if (!collection) {
    collection = await chromaClient.getOrCreateCollection({
      name: "learning_materials",
    })
  }
}

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

export async function POST(request) {
  try {
    await initializeChromaCollection()
    
    const { documents, ids } = await readRawDataFile()

    if (documents.length === 0 || ids.length === 0) {
      return NextResponse.json({ message: 'No valid entries found in the file' }, { status: 400 })
    }

    await collection.add({
      documents: documents,
      ids: ids,
    })

    return NextResponse.json({ message: `${documents.length} documents added successfully` })
  } catch (error) {
    console.error('Error processing file and adding documents:', error)
    return NextResponse.json({ message: 'Error processing file and adding documents' }, { status: 500 })
  }
}