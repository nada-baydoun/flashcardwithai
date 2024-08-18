'use client'

import { useState } from 'react'
import { Container, Box, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const auth = getAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        {user ? (
          <>
            <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} onClick={() => router.push('/generate')}>
              Create Flashcards
            </Button>
            <Button variant="outlined" color="primary" sx={{mt: 2}} onClick={handleLogout}>
              Log Out
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" sx={{mt: 2}} onClick={handleLogin}>
            Sign In with Google
          </Button>
        )}
      </Box>

      <Box sx={{my: 6}}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  AI-Powered Generation
                </Typography>
                <Typography variant="body2">
                  Generate flashcards automatically from any text using advanced AI.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Easy Organization
                </Typography>
                <Typography variant="body2">
                  Organize your flashcards into sets for efficient studying.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Study Anywhere
                </Typography>
                <Typography variant="body2">
                  Access your flashcards from any device, anytime.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}