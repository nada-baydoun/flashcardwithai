import { ChromaClient } from 'chromadb'

const client = new ChromaClient('http://localhost:8000')

let collection

async function initializeChroma() {
  try {
    collection = await client.getOrCreateCollection({
      name: "learning_materials",
    })
    console.log("Chroma collection initialized")
  } catch (error) {
    console.error("Error initializing Chroma:", error)
  }
}

async function addDocuments(documents, ids) {
  if (!collection) {
    await initializeChroma()
  }
  try {
    await collection.add({
      ids: ids,
      documents: documents,
    })
    console.log(`${documents.length} documents added to Chroma`)
  } catch (error) {
    console.error("Error adding documents to Chroma:", error)
  }
}

async function queryChroma(text, numResults = 3) {
  if (!collection) {
    await initializeChroma()
  }
  try {
    const results = await collection.query({
      queryTexts: [text],
      nResults: numResults,
    })
    return results.documents[0] || []
  } catch (error) {
    console.error("Error querying Chroma:", error)
    throw error
  }
}

export { initializeChroma, addDocuments, queryChroma }