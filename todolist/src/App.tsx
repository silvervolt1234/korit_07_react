import { AppBar, Toolbar, Typography, Container, CssBaseline } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Login from "./Login";

const queryclient = new QueryClient();

function App() {

  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Todo List
          </Typography>
        </Toolbar>
      </AppBar>
      <QueryClientProvider client={queryclient}>
        <Login />
      </QueryClientProvider>
    
    </Container>
  )
}

export default App