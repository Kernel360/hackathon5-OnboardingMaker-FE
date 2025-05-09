import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

interface Reply {
  replyId: number;
  userId: number;
  groupId: number;
  content: string;
  finalTime: string;
  parentReplyId?: number | null;
  childReplies?: Reply[];
}

interface MissionInfo {
  title: string;
  deadline: string;
}

const TeamComment: React.FC = () => {
  const { missionId, teamId } = useParams<{
    missionId: string;
    teamId: string;
  }>();
  const groupId = Number(teamId);

  const [mission, setMission] = useState<MissionInfo | null>(null);
  const [newReplyText, setNewReplyText] = useState("");
  const [mainReplies, setMainReplies] = useState<Reply[]>([]);
  const [childReplies, setChildReplies] = useState<Record<number, Reply[]>>({});
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [replyInputTexts, setReplyInputTexts] = useState<
    Record<number, string>
  >({});
  const [replyInputOpen, setReplyInputOpen] = useState<Record<number, boolean>>(
    {},
  );

  // 페이지 로딩 시 미션 정보·댓글들 불러오기
  useEffect(() => {
    fetch(`/api/mission/${missionId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject("미션 정보 실패")))
      .then((data: MissionInfo) => setMission(data))
      .catch(console.error);

    fetch(`/api/reply/${teamId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject("댓글 조회 실패")))
      .then((all: Reply[]) => {
        const mains = all.filter((r) => r.groupId === groupId);
        const nestedMap: Record<number, Reply[]> = {};

        mains.forEach((main) => {
          if (main.childReplies) {
            nestedMap[main.replyId] = main.childReplies;
          }
        });

        console.log("📌 메인 댓글 목록:", mains);
        console.log("📌 대댓글 맵:", nestedMap);

        setMainReplies(mains);
        setChildReplies(nestedMap);
      })
      .catch(console.error);
  }, [missionId, groupId]);
  // ——————————————————————————————

  // 댓글 수정 가능
  const handleEditToggle = (id: number, content: string) => {
    setEditingId(id);
    setEditText(content);
  };

  const handleEditSave = async () => {
    if (editingId === null) return;

    const replyToUpdate = mainReplies.find((r) => r.replyId === editingId);
    if (!replyToUpdate) return;

    try {
      const response = await fetch(`/api/reply/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          userId: replyToUpdate.userId,
          groupId: replyToUpdate.groupId,
          content: editText,
          parentReplyId: replyToUpdate.parentReplyId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("댓글 수정 실패:", response.status, errorText);
        return;
      }

      const updatedReply: Reply = await response.json();
      setMainReplies((prev) =>
        prev.map((reply) =>
          reply.replyId === editingId ? updatedReply : reply,
        ),
      );
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("댓글 수정 중 예외 발생:", err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };
  // ——————————————————————————————

  // 댓글 삭제 가능
  const confirmDelete = async () => {
    if (deleteTarget === null) return;

    try {
      const response = await fetch(`/api/reply/${deleteTarget}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("댓글 삭제 실패:", response.status, errorText);
        return;
      }

      // 메인 댓글에서 삭제
      setMainReplies((prev) =>
        prev.filter((reply) => reply.replyId !== deleteTarget),
      );

      // 대댓글에서 삭제
      setChildReplies((prev) => {
        const updated = { ...prev };
        delete updated[deleteTarget];
        // 모든 대댓글 목록에서 해당 댓글이 부모인 항목 제거
        for (const key in updated) {
          updated[key] = updated[key].filter(
            (r) => r.parentReplyId !== deleteTarget,
          );
        }
        return updated;
      });

      setDeleteTarget(null);
    } catch (error) {
      console.error("댓글 삭제 중 예외 발생:", error);
    }
  };
  // ——————————————————————————————

  //!!!!!!!!!!!!!!!댓글 등록 안됨!!!!!!!!!!!!!!
  const handleAddComment = async () => {
    if (!newReplyText.trim()) return;

    try {
      const requestBody = {
        userId: 15, // 로그인한 유저 ID로 교체 필요
        groupId,
        content: newReplyText,
        parentReplyId: null,
      };

      const response = await fetch("/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("댓글 등록 실패:", response.status, errorText);
        return;
      }

      const savedReply: Reply = await response.json();

      setMainReplies((prev) => [...prev, savedReply]);
      setNewReplyText("");
    } catch (err) {
      console.error("네트워크 오류 또는 기타 예외:", err);
    }
  };

  const handleAddReply = (parentId: number) => {
    const text = replyInputTexts[parentId]?.trim();
    if (!text) return;
    const newReply: Reply = {
      replyId: Date.now(),
      userId: 15,
      groupId,
      content: text,
      finalTime: new Date().toISOString(),
      parentReplyId: parentId,
    };
    setChildReplies((prev) => ({
      ...prev,
      [parentId]: [...(prev[parentId] || []), newReply],
    }));
    setReplyInputTexts((prev) => ({ ...prev, [parentId]: "" }));
    setReplyInputOpen((prev) => ({ ...prev, [parentId]: false }));
  };

  return (
    <Box sx={{ maxWidth: "80%", mx: "auto", mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          📝 온보딩 미션: {mission?.title || "NULL"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          📅 날짜:{" "}
          {mission ? new Date(mission.deadline).toLocaleDateString() : "NULL"}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          👥 {teamId}조
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          💬 댓글
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder="댓글을 입력하세요"
          value={newReplyText}
          onChange={(e) => setNewReplyText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAddComment}>
          댓글 등록
        </Button>

        <List sx={{ mt: 3 }}>
          {mainReplies.map((reply) => (
            <React.Fragment key={reply.replyId}>
              <ListItem alignItems="flex-start">
                <Box sx={{ width: "100%" }}>
                  <Box display="flex" justifyContent="space-between">
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" color="text.secondary">
                          ✍️ 사용자 #{reply.userId}
                        </Typography>
                      }
                      secondary={
                        editingId === reply.replyId ? (
                          <TextField
                            fullWidth
                            multiline
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            sx={{ mt: 0.5 }}
                          />
                        ) : (
                          <>
                            <Typography
                              sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}
                            >
                              {reply.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              🕒 {new Date(reply.finalTime).toLocaleString()}
                            </Typography>
                          </>
                        )
                      }
                    />
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-end"
                      ml={2}
                    >
                      {editingId === reply.replyId ? (
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
                          <Button
                            size="small"
                            onClick={() =>
                              handleEditToggle(reply.replyId, reply.content)
                            }
                          >
                            수정
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(reply.replyId)}
                          >
                            삭제
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>

                  {childReplies[reply.replyId]?.length > 0 && (
                    <List component="div" disablePadding sx={{ pl: 4, mt: 1 }}>
                      {childReplies[reply.replyId].map((child) => (
                        <ListItem key={child.replyId}>
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                ↪️ 사용자 #{child.userId}
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                                {child.content}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}

                  <Box sx={{ pl: 4, mt: 1 }}>
                    <Button
                      size="small"
                      onClick={() =>
                        setReplyInputOpen((prev) => ({
                          ...prev,
                          [reply.replyId]: !prev[reply.replyId],
                        }))
                      }
                    >
                      {replyInputOpen[reply.replyId] ? "" : "답글 달기"}
                    </Button>

                    {replyInputOpen[reply.replyId] && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="대댓글 입력"
                          value={replyInputTexts[reply.replyId] || ""}
                          onChange={(e) =>
                            setReplyInputTexts({
                              ...replyInputTexts,
                              [reply.replyId]: e.target.value,
                            })
                          }
                        />
                        <Button
                          size="small"
                          onClick={() => handleAddReply(reply.replyId)}
                        >
                          등록
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            setReplyInputOpen((prev) => ({
                              ...prev,
                              [reply.replyId]: false,
                            }))
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

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      >
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
