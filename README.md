# nb04-sevem-team1

## 팀원 구성

- [손준영](https://github.com/proteiin)
- [이재훈](https://github.com/jaehoon21)
- [이제창](https://github.com/Jerang2)
- [전범주](https://github.com/intwocave)
- [홍준기](https://github.com/InsipidPie1229)

## 프로젝트 소개

기록 기반의 운동 커뮤니티 서비스 'SEVEN'의 백엔드 시스템입니다. 사용자는 그룹을 생성하고 참여하여 운동 기록을 공유하고, 다른 참여자들과 랭킹을 통해 경쟁할 수 있습니다.

- **프로젝트 기간**: 2024.08.11 ~ 2024.08.29

## 기술 스택

- **Backend**: Express.js, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Render
- **공통 Tool**: Git & Github, Discord (웹훅 알림)

## 팀원별 구현 기능 상세

- 손준영: 그룹 코드 구현
- 이재훈: 그룹 추천 / 태그 / 뱃지
- 이제창: 운동 기록
- 전범주: 랭킹 / 이미지 업로드 / 코드 리펙토링
- 홍준기: 참여자 / 그룹 코드 구현 Sub

## 파일 구조

```jsx
src
┣ controller
┃ ┣ group-controller.js
┃ ┣ image-controller.js
┃ ┣ like-controller.js
┃ ┣ ranking-controller.js
┃ ┣ records-controller.js
┃ ┣ tag-controller.js
┃ ┗ user-controller.js
┣ middleware
┃ ┣ group-middleware.js
┃ ┣ records-middleware.js
┃ ┣ user-validation-middleware.js
┃ ┗ validate.js
┣ repository
┃ ┣ group-repository.js
┃ ┣ group-tag-repository.js
┃ ┣ image-repository.js
┃ ┣ like-repository.js
┃ ┣ ranking-repository.js
┃ ┣ records-repository.js
┃ ┣ tag-repository.js
┃ ┗ user-repository.js
┣ router
┃ ┣ group-router.js
┃ ┣ image-router.js
┃ ┣ like-router.js
┃ ┣ ranking-router.js
┃ ┣ records-router.js
┃ ┣ tag-router.js
┃ ┗ user-router.js
┣ service
┃ ┣ group-service.js
┃ ┣ image-service.js
┃ ┣ like-service.js
┃ ┣ ranking-service.js
┃ ┣ records-service.js
┃ ┣ tag-service.js
┃ ┗ user-service.js
┗ container.js
prisma
┣ schema.prisma
┗ seed.js
.env
.gitignore
main.js
package-lock.json
package.json
README.md
```

## 구현 홈페이지

https://node04-seven-1-fe.onrender.com/
