import { ChangeEvent, useState } from "react";
import { Button, TextField, Snackbar, Divider, Box, CircularProgress, Stack, Alert } from "@mui/material";
import { AccountCredentials } from "../../type";
import { login, authenticateWithGoogleToken } from "../api/shoppingapi";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

type LoginProps = {
  loginSuccess: () => void;
}

function Login({loginSuccess}: LoginProps) {
  const [ user, setUser ] = useState<AccountCredentials>({ username: '', password: ''});
  const [ open, setOpen ] = useState(false);
  const [ errorMsg, setErrorMsg ] = useState('Login failed');
  const [ loading, setLoading ] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [event.target.name]: event.target.value});
  };

  // 아이디/비밀번호 로그인
  const handleUsernamePasswordLogin = () => {
    setLoading(true); // 로딩 시작
    login(user)
      .then(authorizationHeader => {
      sessionStorage.setItem('jwt', authorizationHeader);
      loginSuccess();
    })
    .catch( err => {
      setErrorMsg(err.message || "예상하지 못한 로그인 관련 에러가 발생했습니다.");
      setOpen(true);
    })
    .finally(() => {
      setLoading(false);  // 로딩 종료
    })
  };

  // Google 로그인
  const handleGoogleLoginSuccess = async (credentialResponse : CredentialResponse) => {
    console.log('Google Login Success(Frontend 상황에서) : ', credentialResponse);
    if(credentialResponse.credential) {
      setLoading(true);
      try {
        // Google ID 토큰을 백엔드로 보내 JWT 받아오는 과정
        const backendJwt = await authenticateWithGoogleToken(credentialResponse.credential);
        sessionStorage.setItem('jwt', backendJwt);
        loginSuccess();
      }
      catch (error:any) {
        console.error('구글 로그인 중에 백엔드 부분 인증 실패', error);
        setErrorMsg(`구글 로그인은 성공했으나 백엔드에서 오류 발생했습니다. ${error?.message || '알 수 없는 에러'}`);
        setOpen(true);
      }
      finally {
        setLoading(false);
      }
    } else {
      console.error('응답 결과에서 Google Credential을 찾을 수 없습니다.');
      setErrorMsg('Google Login Failed : Credential Not Found');
      setOpen(true);
    }
  };

  // Google 로그인 실패 관련 callback
  const handleGoogleLoginError = () => {
    console.error('Google Login Failed (Frontend)');
    setErrorMsg('구글 로그인 자체가 실패해습니다. 다시 시도하거나 좀 있다 시도하세요.');
    setOpen(true);
  };

  const handleKeyPress = ( event : KeyboardEvent ) => {
    if( event.key === 'Enter' && !loading ) { // 로딩 중에는 엔터키로 로그인 못하게
      handleUsernamePasswordLogin();
    }
  };

  return(
    <>
      <Stack spacing={2} alignItems="center" mt={10}>
        <h2>Login</h2>
        <TextField 
          name="username"
          label="Username"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
          sx={{width: '300px'}}
        />
        <TextField 
          type="password"
          name="password"
          label="Password"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{width: '300px'}}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUsernamePasswordLogin}
          disabled={loading}
          sx={{width: '300px'}}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN WITH USERNAME"}
        </Button>

        <Divider sx={{width: '300px', my: 2}}>OR</Divider>

        {/* Google 로그인 버튼 부분 */}
        <Box sx={{width: '300px', display: 'flex', justifyContent: 'center', opacity: loading ? 0.5 : 1}}>
          {/** Loading 중일떄는 Google 버튼을 숨기거나 바활성화. 혹은 투명도 조절**/}
          {!loading && (
            <GoogleLogin 
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap={false}
              width={'300px'}
            />
          )}
          {loading && <CircularProgress size={24} />}
        </Box>
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={(() => setOpen(false))}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert severity="error" onClose={() => setOpen(false)}>{errorMsg}</Alert>

      </Snackbar>
    </>
  )
}

export default Login