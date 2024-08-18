'use client';
import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material'

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [mcqFlashcards, setMcqFlashcards] = useState([])
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false)
  const [isLoadingMcqs, setIsLoadingMcqs] = useState(false)
  const [flippedCards, setFlippedCards] = useState({})

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards and MCQs.')
      return
    }

    setIsLoadingFlashcards(true)
    setIsLoadingMcqs(true)
    setFlashcards([])
    setMcqFlashcards([])
    setFlippedCards({})

    await generateFlashcards()
    await generateMcqFlashcards()
  }

  const generateFlashcards = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(prev => [...prev, ...data.flashcards])
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    } finally {
      setIsLoadingFlashcards(false)
    }
  }

  const generateMcqFlashcards = async () => {
    try {
      const response = await fetch('/api/mcq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate MCQ flashcards')
      }

      const data = await response.json()
      setMcqFlashcards(prev => [...prev, ...data.mcqFlashcards])
    } catch (error) {
      console.error('Error generating MCQ flashcards:', error)
      alert('An error occurred while generating MCQ flashcards. Please try again.')
    } finally {
      setIsLoadingMcqs(false)
    }
  }

  const handleLoadMoreFlashcards = () => {
    setIsLoadingFlashcards(true)
    generateFlashcards()
  }

  const handleLoadMoreMcqFlashcards = () => {
    setIsLoadingMcqs(true)
    generateMcqFlashcards()
  }

  const handleCardFlip = (index, type) => {
    setFlippedCards(prev => ({
      ...prev,
      [`${type}-${index}`]: !prev[`${type}-${index}`]
    }))
  }

  const renderFlashcards = (cards, type) => (
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={`${type}-${index}`}>
            <Card 
              onClick={() => handleCardFlip(index, type)}
              sx={{
                height: 250, // Increased height to accommodate more text
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent
                sx={{
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start', // Changed to align text to the left
                  transform: flippedCards[`${type}-${index}`] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.6s',
                  padding: '16px', // Added padding for better text placement
                  overflow: 'auto', // Allow scrolling if content overflows
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  {card.front}
                </Typography>
              </CardContent>
              <CardContent
                sx={{
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start', // Changed to align text to the left
                  transform: flippedCards[`${type}-${index}`] ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  transition: 'transform 0.6s',
                  padding: '16px', // Added padding for better text placement
                  overflow: 'auto', // Allow scrolling if content overflows
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  {card.back}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards and MCQs
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={isLoadingFlashcards || isLoadingMcqs}
        >
          {(isLoadingFlashcards || isLoadingMcqs) ? 'Generating...' : 'Generate Flashcards and MCQs'}
        </Button>
      </Box>
      
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          {renderFlashcards(flashcards, 'flashcard')}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleLoadMoreFlashcards}
              disabled={isLoadingFlashcards}
            >
              {isLoadingFlashcards ? <CircularProgress size={24} /> : 'Load More Flashcards'}
            </Button>
          </Box>
        </Box>
      )}

      {mcqFlashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated MCQ Flashcards
          </Typography>
          {renderFlashcards(mcqFlashcards, 'mcq')}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleLoadMoreMcqFlashcards}
              disabled={isLoadingMcqs}
            >
              {isLoadingMcqs ? <CircularProgress size={24} /> : 'Load More MCQ Flashcards'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  )
}