import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CssBaseline,
} from "@mui/material";

const Login: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: form.email,
          password: form.password,
        }),
        credentials: "include",
      });
      if (response.ok) {
        // 로그인 성공 시 메인 페이지로 이동
        navigate("/main");
      } else {
        const errorMsg = await response.text();
        alert(`로그인 실패: ${errorMsg}`);
      }
    } catch (error) {
      console.error("로그인 요청 중 오류:", error);
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xs"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            로그인
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="이메일"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="비밀번호"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
              required
            />

            <Button type="submit" variant="contained" fullWidth>
              로그인
            </Button>

            <Button component={Link} to="/signup" variant="outlined" fullWidth>
              회원가입
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
