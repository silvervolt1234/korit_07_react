import { AppBar, Toolbar, Typography, Container, CssBaseline } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Carlist from "./components/Carlist";

const queryclient = new QueryClient();

function App() {

  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Car Shop
          </Typography>
        </Toolbar>
      </AppBar>
      <QueryClientProvider client={queryclient}>
        <Carlist />
      </QueryClientProvider>
    
    </Container>
  )
}

export default App
