import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Stack, Snackbar } from "@mui/material";
import Todo from "./Todo";

type User = {
  username: string;
  password: string;
}

function Login() {
  const [ user, setUser ] = useState<User>({
    username: '',
    password: ''
  });
  const [ isAuthenticated, setAuth ] = useState(false);
  const [ open, setOpen ] = useState(false);


  // 로그인 유지용
  useEffect(() => { 
    const token = sessionStorage.getItem("jwt");
    if (token) {
      setAuth(true);
    }
  }, []);


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [event.target.name]: event.target.value});
  };

  const handleLogin = (event?: FormEvent) => {
    if (event) event.preventDefault();
    // 일부러 템플릿 리터럴로 미작성
    axios.post(import.meta.env.VITE_API_URL + "/login", user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      const jwtToken = res.headers.authorization;
      if(jwtToken !== null) {
        sessionStorage.setItem("jwt", jwtToken);
        setAuth(true);
      }
    })
    .catch(err => {
      console.log(err)
    });
  }

  if (isAuthenticated) {
    return<Todo />
  } else {
    return(
    <form onSubmit={handleLogin}>
    <Stack spacing={2} alignItems={"center"} mt={2}>
      <TextField 
        name="username"
        label="Username"
        onChange={handleChange}
      />
      <TextField 
        type="password"
        name="password"
        label="Password"
        onChange={handleChange}
      />
      <Button 
          type="submit"
        variant="outlined"
        color="primary"
        onClick={handleLogin}
      >
        Login
      </Button>
      <Snackbar 
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="ID 혹은 비밀번호가 틀렸습니다."
      />
    </Stack>
    </form>
  );
  }
}

export default Login