'use client'

import { useEffect, useState } from 'react'
import { Container, Grid, Card, CardContent, Typography, CardActionArea, Box } from '@mui/material'
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useSearchParams } from 'next/navigation'

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const searchParams = useSearchParams()
  const setId = searchParams.get('id')
  const auth = getAuth();

  useEffect(() => {
    async function getFlashcards() {
      if (!setId) return;
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(collection(db, 'users'), user.uid)
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setId)
      const setDoc = await getDoc(setDocRef)
      
      if (setDoc.exists()) {
        setFlashcards(setDoc.data().flashcards)
      }
    }
    getFlashcards()
  }, [setId])

  const handleCardClick = (index) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box sx={{ 
                    height: 200, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      backfaceVisibility: 'hidden'
                    }}>
                      <Typography variant="h5" component="div">
                        {flashcard.front}
                      </Typography>
                    </div>
                    <div style={{
                      position: 'absolute',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}>
                      <Typography variant="h5" component="div">
                        {flashcard.back}
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}