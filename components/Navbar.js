import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Flashcard SaaS
        </Typography>
        <Button color="inherit" component={Link} href="/">
          Home
        </Button>
        <Button color="inherit" component={Link} href="/generate">
          Generate
        </Button>
        <Button color="inherit" component={Link} href="/flashcards">
          My Flashcards
        </Button>
      </Toolbar>
    </AppBar>
  );
}