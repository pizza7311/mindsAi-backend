## Minds Ai 백엔드 과제
### 기술 스택
* Nest.js
* Prisma
* Docker

### 실행 방법
해당 프로젝트는 백엔드는 `node:20` db는 `mysql:8.0` docker 이미지에서 실행됩니다.  
**참고**: 해당 프로젝트를 실행시키기 전 호스트 pc에서 mysql 서비스가 실행중이라면 종료 시켜야합니다.  

### .env 파일
실행전 아래의 내용을 프로젝트 루트 디렉토리에 `.env` 파일로 추가합니다
```
DATABASE_URL="mysql://root:rootpassword@db:3306/mindsai"
MYSQL_ROOT_PASSWORD="rootpassword"
MYSQL_USER='test'
MYSQL_PASSWORD='devpassword'
MYSQL_DATABASE='mindsai'
MYSQL_HOST='db'

JWT_SECRET='some jwt text'
```

### 초기화 및 실행
![image](https://github.com/user-attachments/assets/89a63461-69f9-48db-9d95-001d791e6bbf)

```
npm run docker:init
```
백엔드 소스 코드를 포함하여 'mindsai-backend' docker 이미지를 빌드하고 실행시키며 mysql db 컨테이너를 실행시킵니다.  
db 컨테이너 초기화가 끝나면 backend 컨테이너에서 prisma 초기화를 실행하고 `http://localhost:3000` 에서 nest.js 앱이 **dev 모드**로 실행됩니다.  

### 실행 중지 및 다시 실행
```
npm run docker:stop
```
실행중인 컨테이너들을 중지시킵니다.  
```
npm run docker:start
```
중지된 컨테이너를 다시 실행시킵니다.  

### e2e 테스트 실행
![image](https://github.com/user-attachments/assets/98fe02a1-2161-44ce-aa76-4388f0c78f2d)

해당 프로젝트에서 작성된 e2e 테스트는 별도의 테스트용 db를 구축하지 않아 실제 실행중인 db에서 e2e 테스트를 실행합니다.  
e2e 테스트를 실행하면 호스트에서 실행중인 db 컨테이너와 연결하여 테스트를 진행합니다.  
컨테이너에서 nest를 실행시킬때와 e2e 테스트시 사용하는 DATABASE_URL이 서로 다릅니다 아직 동적으로 env를 적용하는 기능은 구현되지 않아 직접 `.env` 의 `DATABASE_URL` 을 수정해줘야 합니다.  
아래의 순서대로 진행해 주세요.  

1. .env 파일 수정
```
# .env
# db->localhost 로 변경
DATABASE_URL="mysql://root:rootpassword@localhost:3306/mindsai"
```
2. npm run prisma:deploy 명령어 실행  
host 와 실행중인 db의 prisma 초기화 작업을 실행하는 과정입니다.
3. npm run test:e2e 명령어 실행
e2e 테스트 코드를 실행 합니다.
