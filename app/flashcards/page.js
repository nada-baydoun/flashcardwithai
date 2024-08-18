'use client'

import { useEffect, useState } from 'react'
import { Container, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material'
import { getAuth } from "firebase/auth";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useRouter } from 'next/navigation'

export default function Flashcards() {
  const [flashcardSets, setFlashcardSets] = useState([])
  const router = useRouter()
  const auth = getAuth();

  useEffect(() => {
    async function getFlashcardSets() {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(collection(db, 'users'), user.uid)
      const setsCollectionRef = collection(userDocRef, 'flashcardSets')
      const querySnapshot = await getDocs(setsCollectionRef)
      
      const sets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setFlashcardSets(sets)
    }
    getFlashcardSets()
  }, [])

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcardSets.map((set) => (
          <Grid item xs={12} sm={6} md={4} key={set.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(set.id)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {set.id}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}