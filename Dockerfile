# 베이스 이미지 설정
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm install --omit=dev

# 소스 코드 복사
COPY . .

# 불필요한 개발 관련 파일 제거
RUN rm -rf tests/ .eslintrc.js .prettierrc.js jest.config.js

# 환경변수 설정
ENV NODE_ENV=production
ENV PORT=5004

# 포트 노출
EXPOSE 5004

# 애플리케이션 실행
CMD ["node", "src/app.js"]