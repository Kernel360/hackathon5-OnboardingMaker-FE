import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Box, CssBaseline } from "@mui/material";

const Login: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            로그인
          </Typography>

          <Box
            component="form"
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              로그인
            </Button>

            <Button
              component={Link}
              to="/signup"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
            >
              회원가입
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
