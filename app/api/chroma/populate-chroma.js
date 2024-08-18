const fs = require('fs');
const readline = require('readline');
const { ChromaClient } = require('chromadb');

const chromaClient = new ChromaClient();

async function initializeChromaCollection() {
  return await chromaClient.getOrCreateCollection({
    name: "learning_materials",
  });
}

async function processFile(filePath) {
  const collection = await initializeChromaCollection();
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentId = null;
  let currentDocument = '';
  let documentsToAdd = [];

  for await (const line of rl) {
    if (line.startsWith('ID: ')) {
      if (currentId && currentDocument) {
        documentsToAdd.push({ id: currentId, document: currentDocument.trim() });
        if (documentsToAdd.length >= 100) {
          await addDocumentsToChroma(collection, documentsToAdd);
          documentsToAdd = [];
        }
      }
      currentId = line.slice(3).trim();
      currentDocument = '';
    } else if (line.startsWith('Document: ')) {
      currentDocument = line.slice(10);
    } else {
      currentDocument += ' ' + line;
    }
  }

  // Add the last document if there is one
  if (currentId && currentDocument) {
    documentsToAdd.push({ id: currentId, document: currentDocument.trim() });
  }

  // Add any remaining documents
  if (documentsToAdd.length > 0) {
    await addDocumentsToChroma(collection, documentsToAdd);
  }

  console.log('All documents have been added to Chroma.');
}

async function addDocumentsToChroma(collection, documents) {
  await collection.add({
    ids: documents.map(doc => doc.id),
    documents: documents.map(doc => doc.document),
  });
  console.log(`Added ${documents.length} documents to Chroma.`);
}

// Usage
const filePath = 'rawdata.txt';
processFile(filePath).catch(console.error);