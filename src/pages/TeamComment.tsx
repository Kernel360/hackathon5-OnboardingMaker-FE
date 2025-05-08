import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Box, Button, Divider, List, ListItem, ListItemText, Paper, TextField, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

interface Comment {
  id: number;
  author: string;
  text: string;
  replies?: Comment[]; //대댓글로 확장
}

const TeamComment: React.FC = () => {
  const { missionId, teamId } = useParams();

  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: "Alice", text: "좋은 미션이네요!" },
    { id: 2, author: "Bob", text: "재미있을 것 같아요!" },
  ]);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<{ [key: number]: string }>({});
  const [replyOpen, setReplyOpen] = useState<{ [key: number]: boolean }>({});

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          author: "나",
          text: comment,
        },
      ]);
      setComment("");
    }
  };

  const confirmDelete = () => {
    setComments((prev) => prev.filter((c) => c.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const handleEditToggle = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleEditSave = () => {
    if (editingId !== null) {
      setComments(
        comments.map((c) =>
          c.id === editingId ? { ...c, text: editText } : c
        )
      );
      setEditingId(null);
      setEditText("");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleAddReply = (parentId: number) => {
    const text = replyTexts[parentId]?.trim();
    if (text) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  {
                    id: Date.now(),
                    author: "나",
                    text,
                  },
                ],
              }
            : comment
        )
      );
      setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
      setReplyOpen((prev) => ({ ...prev, [parentId]: false }));
    }
  };

  return (
    <Box sx={{ maxWidth: "80%", mx: "auto", mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          📝 온보딩 미션: API 연동 과제
        </Typography>
        <Typography variant="body1" color="text.secondary">
          📅 날짜: 2025-05-08
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          👥 3조
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          💬 댓글
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="댓글을 입력하세요..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAddComment}>
          댓글 등록
        </Button>

        <List sx={{ mt: 3 }}>
          {comments.map((c) => (
            <React.Fragment key={c.id}>
              <ListItem alignItems="flex-start">
                <Box sx={{ width: "100%" }}>
                  {/* 댓글 본문 */}
                  <Box display="flex" justifyContent="space-between">
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" color="text.secondary">
                          ✍️ {c.author}
                        </Typography>
                      }
                      secondary={
                        editingId === c.id ? (
                          <TextField
                            fullWidth
                            multiline
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            sx={{ mt: 0.5 }}
                          />
                        ) : (
                          <Typography
                            sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}
                            component="span"
                          >
                            {c.text}
                          </Typography>
                        )
                      }
                    />
                    {/* 수정/삭제 버튼 */}
                    <Stack spacing={1} direction="column" alignItems="flex-end" ml={2}>
                      {editingId === c.id ? (
                        <>
                          <Button size="small" onClick={handleEditSave}>
                            수정 완료
                          </Button>
                          <Button size="small" onClick={handleEditCancel}>
                            취소
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="small" onClick={() => handleEditToggle(c.id, c.text)}>
                            수정
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(c.id)}
                          >
                            삭제
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>

                  {/* 대댓글 리스트 */}
                  {c.replies && c.replies.length > 0 && (
                    <List component="div" disablePadding sx={{ pl: 4, mt: 1 }}>
                      {c.replies.map((reply) => (
                        <ListItem key={reply.id}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="text.secondary">
                                ↪️ {reply.author}
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                                {reply.text}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}

                  {/* 답글 입력 영역 */}
                  <Box sx={{ pl: 4, mt: 1 }}>
                    <Button
                      size="small"
                      onClick={() =>
                        setReplyOpen((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                      }
                    >
                      {replyOpen[c.id] ? "" : "답글 달기"}
                    </Button>

                    {replyOpen[c.id] && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="대댓글 입력"
                          value={replyTexts[c.id] || ""}
                          onChange={(e) =>
                            setReplyTexts({ ...replyTexts, [c.id]: e.target.value })
                          }
                        />
                        <Button size="small" onClick={() => handleAddReply(c.id)}>
                          등록
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            setReplyOpen((prev) => ({ ...prev, [c.id]: false }))
                          }
                        >
                          취소
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>❗ 댓글 삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            해당 댓글을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>취소</Button>
          <Button onClick={confirmDelete}>확인</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamComment;