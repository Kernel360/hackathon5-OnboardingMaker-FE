import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, FormControlLabel, Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 일치 검사
    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: form.nickname,
          email: form.email,
          password: form.password,
          isAdmin: form.isAdmin,
        }),
        credentials: "include",
      });

      if (response.status === 201) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      } else {
        const errorMsg = await response.text();
        setError(`회원가입 실패: ${errorMsg}`);
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류:", error);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", borderRadius: 2, bgcolor: "background.paper" }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            회원가입
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="닉네임"
              name="nickname"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              fullWidth
              required
            />
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
            <TextField
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              fullWidth
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isAdmin}
                  onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
                  name="isAdmin"
                />
              }
              label="관리자 계정으로 가입"
            />

            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              회원가입
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Signup;