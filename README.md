### 📝 온보딩 메이커
kernel360 데일리 미션 관리를 위한 협업 웹 서비스 <br/>
📆 2025.05.07 ~ 2025.05.09
<br/>
<br/>
### 프로젝트 소개
😤 노션으로 온보딩 데일리 미션을 관리할 때 발생하던 번잡함, 불편함을 해소하기 위함 <br/>
ex) 노션에서 실수로 다른 조의 갤러리를 삭제 <br/>
=> 온보딩 데일리 미션 웹을 만들어서 깔끔하게 관리할 수 있게 해보자!
<br/>
<br/>
### 주요 기능
- 로그인 / 회원가입 (Session 기반 인증)
- 관리자 데일리 미션 등록
  - 미션(=제목)과 상세 설명, 마감 기한, 학생들을 총 몇 조로 나눌 것인지 입력 가능합니다.
- 데일리 미션 리스트 조회
  - 관리자의 경우, 일주일치 온보딩 미션 우측에 미션 생성 버튼이 뜨게 됩니다.
  - 학생의 경우, 우측에 아무것도 뜨지 않습니다.
- 데일리 미션별로 생성된 팀 목록 조회
    - 관리자가 입력한 조의 개수에 맞게 버튼이 생깁니다. (1조, 2조, …)
    - 버튼 클릭 시 어떠한 미션의 특정 조 페이지에 들어갈 수 있게 됩니다.
- 미션별 팀 페이지에서 댓글 및 대댓글로 소통
    - 댓글 CRUD
    - 대댓글 CRUD

<br/>

### 팀 소개
| 이현경 | 이제훈 | 정다은 | 조나단 | 김수정 |
|--------|--------|--------|--------|--------|
| 역할 A | 인프라, CI/CD 구축 | 메인페이지 &middot; 대댓글 API 제작 <br> (댓글 API 수정) | 로그인 고도화 & 미션별 조 조회, 회원가입 API 제작 | Swagger적용, Mission 글쓰기 관련 API구현 및 연동, TeamList API 구현 및 연동 |
<br/>

### 기술 스택
🛠️ **Frontend**<br/>
<br/>
<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>&nbsp;&nbsp;<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>&nbsp;&nbsp;<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white"/>
<br/>
<br/>
🛠️ **Backend**<br/>
<br/>
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=OpenJDK&logoColor=white">&nbsp;&nbsp;<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">&nbsp;&nbsp;<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">&nbsp;&nbsp;<img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=Amazon%20S3&logoColor=white">&nbsp;&nbsp;
<br/>
<br/>
🛠️ **Infra & DevOps**<br/>
<br/>
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">&nbsp;&nbsp;<img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white">
<br/>
<br/>
### 🗺 ERD
![Image](https://github.com/user-attachments/assets/abd097bc-24ad-4734-b1be-f2c7dea745ce)
<br/>
<br/>
