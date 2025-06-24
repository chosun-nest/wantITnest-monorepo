# Want-IT-Nest

> 흩어진 정보와 사람을 하나로, 함께 성장하는 IT 커뮤니티 플랫폼
- **배포 주소**: [https://wantitnest.co.kr](https://wantitnest.co.kr)

**Want-IT-Nest**는 조선대학교 IT융합대학 재학생과 졸업생 간의 실질적인 정보 공유 및 진로 네트워킹을 지원하는 웹 기반 커뮤니티 플랫폼입니다. 학사/장학 공지, 프로젝트 모집, 관심 분야 토론, 프로필 기반 커뮤니케이션, AI 챗봇 등의 기능을 통합하여, IT 전공자의 커리어 성장을 돕습니다.

---

## 🔍 주요 기능

- **메인 페이지**: 관심 태그 기반 콘텐츠 요약, 공지/모집글/인기글 통합 표시
- **프로필 시스템**: 기술 스택, 활동 히스토리, 팔로우 기반 소셜 연결
- **공지사항 게시판**: 조선대 전공/사업단 공지를 자동 크롤링하여 통합 제공
- **관심분야 게시판**: 질문, 정보 공유, 경험담 나눔 등 마크다운 기반 커뮤니티
- **프로젝트 모집 게시판**: 팀원 모집, 역할 기반 지원 시스템
- **실시간 채팅**: 팔로우 기반 1:1 및 그룹 채팅 지원 (Socket.IO)
- **AI 챗봇**: OpenAI GPT-4o API를 활용한 FAQ + 자유 질문 응답 기능

---

## ⚙️ 기술 스택

### Frontend
- React.js, TypeScript, TailwindCSS, Styled-Components
- React Router, Redux Toolkit, React Markdown

### Backend
- Java 17 (Eclipse Temurin), Spring Boot 3.4.3
- REST API, Spring Security (JWT 기반 인증/인가)
- MySQL 8.0.33 (JPA 기반 ORM)

### 실시간/AI 서비스
- Node.js + Socket.IO (실시간 채팅)
- Python FastAPI + OpenAI API (AI 챗봇)
- BeautifulSoup + Selenium (공지 크롤러)

### DevOps & Infra
- Docker / Docker Compose
- AWS EC2 기반 2-Tier 구조 (Public + Private Subnet)
- GitLab + Git Subtree (멀티 레포 통합 관리)

---

## 🗂 저장소 구조

```
/frontend             # React 프론트엔드
/backend              # Spring Boot 백엔드
/chatbot-api          # FastAPI 기반 AI 챗봇 서버
/node-backend         # Socket.IO 채팅 서버
/scheduler            # 공지사항 크롤러 서버
/nginx                # 리버스 프록시 설정
/mysql                # DB 초기화 설정
/docker-compose.*     # 배포 환경 설정
```

---

## 🚀 실행 방법 (로컬 개발 환경)

1. `.env.frontend`와 `.env.backend` 파일을 설정합니다.
2. Docker Desktop 실행
3. 아래 명령어로 실행:

```bash
# 백엔드
./docker-run-backend.sh

# 프론트엔드
./docker-run-frontend.sh
```

---

## 👨‍💻 팀 소개

| 이름     | 역할         | 담당 파트                            |
|----------|--------------|-------------------------------------|
| 이지혁   | 팀장 / PM / 백엔드 | 프로젝트 모집 게시판, 일정 조율            |
| 김영은   | 프론트엔드   | 프로필 페이지, 게시판 글쓰기 등         |
| 김채호   | 백엔드 리더       | 인증/인가 시스템, 전체 구조 설계        |
| 민혜린   | AI / 데이터  | 챗봇, 공지 크롤러 기능 구현            |
| 송채선   | 백엔드       | 게시판, 댓글 도메인, 배포 담당         |
| 오유겸   | 프론트엔드   | 프로젝트 모집, 공지사항 화면 개발       |
| 윤금상   | 프론트엔드 리더 | 채팅 서버 개발, 인증 UI 구현            |

---

## 📎 기타

- **Figma UI 시안**: [CSU-NEST 프로토타입](https://www.figma.com/proto/OOqaT6pOp85uw5IvfGjHy3/CSU-NEST)
- **배포 주소**: [https://wantitnest.co.kr](https://wantitnest.co.kr)

---

## 📄 라이선스

본 프로젝트는 **학부 졸업작품 및 비영리 목적의 산학협력 과제**로 제작되었습니다.  
일부 소스코드는 조선대학교 수업 및 GitLab 과제 기준에 따라 외부 공개가 제한될 수 있습니다.
