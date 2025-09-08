# 🌊 Surf 프론트엔드 코드 컨벤션

본 문서는 Surf 프로젝트의 **브랜치 / 커밋 / 코드 스타일** 규칙을 정의합니다.  
기수가 바뀌더라도 일관성 있는 코드 품질과 협업 효율성을 유지하기 위함입니다.

---

## 🌲 Branch Convention

### 1. Branch Naming Rules
- 기본 규칙: **브랜치 Type/작업 내용**
- 작업 내용은 간결하고 명확하게 작성합니다.

#### Examples
feat/login-api
fix/navbar-overlap-210


### 2. Branch Types
- **feat/** → 새로운 기능 개발  
  e.g. `feat/login-api-123`
- **fix/** → 버그 수정  
  e.g. `fix/navbar-overlap-210`
- **hotfix/** → 운영 중 긴급 버그 수정 (main에 직접 패치)  
  e.g. `hotfix/prod-payment-error-555`
- **refactor/** → 리팩토링 (동작 변경 없음, 구조/성능 개선)  
  e.g. `refactor/user-service-98`
- **style/** → UI, CSS 스타일 작업  
  e.g. `style/homepage-header-45`
- **docs/** → 문서 작업  
  e.g. `docs/contribution-guide-12`
- **chore/** → 빌드/설정/배포/의존성 업데이트  
  e.g. `chore/update-eslint-config-77`
- **test/** → 테스트 코드 추가/수정  
  e.g. `test/user-service-coverage-331`
- **release/** → 배포 준비 브랜치  
  e.g. `release/v1.0.0`

---

## 📩 Commit Convention

### 1. Commit Message Rules
- 기본 규칙: **[기능 Type][GitHub 닉네임]: 작업 내용 (#이슈번호 선택)**

#### Examples
[feat][rngrhn4114]: 로그인 API 연동 (#39)
[fix][chaejy]: 비밀번호 유효성 검사 버그 수정 (#52)


### 2. Commit Types
1. **feat**: 새로운 기능 추가 → `feat: 회원가입 기능 추가`
2. **fix**: 버그 수정 → `fix: 비밀번호 유효성 검사 버그 수정`
3. **refactor**: 리팩토링 (구조/성능 개선) → `refactor: 유저 서비스 모듈 구조 리팩토링`
4. **style**: 코드 스타일 변경 (UI/포맷 관련, 기능 영향 없음) → `style: 로그인 버튼 색상 변경`
5. **format**: 코드 포맷팅 (prettier, eslint 등) → `format: prettier 규칙 적용`
6. **docs**: 문서 작업 → `docs: README에 실행 방법 추가`
7. **chore**: 환경 설정/빌드/배포/의존성 → `chore: ESLint, Prettier 초기 세팅`
8. **add**: 신규 파일/라이브러리 추가 → `add: date-fns 라이브러리 추가`
9. **del**: 불필요한 코드/파일 제거 → `del: legacy API 모듈 제거`
10. **test**: 테스트 코드 추가/수정 → `test: 유저 서비스 단위 테스트 보강`

---

## 👩🏻‍💻 Code Convention

### 1. Naming Convention
- **camelCase**
  - 함수명, 변수명, 파일명 → `getUserInfo`, `userList`
- **PascalCase**
  - 클래스명, 인터페이스명, React 컴포넌트명 → `UserService`, `LoginForm`
- **SNAKE_CASE**
  - 상수, 매크로, 환경변수, DB 속성 → `MAX_RETRY_COUNT`, `DB_USER_NAME`
- **kebab-case**
  - URL, CSS 클래스명, 폴더명 → `/user-profile`, `.main-header`

---

### 2. 코드 작성 원칙

#### 📖 가독성
- 변수와 함수는 역할이 명확히 드러나게 네이밍합니다.
- 파일/컴포넌트는 단일 책임 원칙(SRP)을 지향합니다.

#### 🛡️ 안정성
- 예외 처리를 반드시 포함합니다 (`try/catch`, 조건문 가드).
- Null/Undefined 방어 로직을 작성합니다.

#### 🧪 테스트 용이성
- 단위 테스트/통합 테스트 작성이 쉬운 구조를 유지합니다.
- 중요한 로직은 Jest/RTL 기반 테스트를 권장합니다.
- Storybook을 통한 UI 테스트를 병행합니다.

#### 🔧 유지보수성
- 반복되는 로직은 유틸 함수/공통 컴포넌트로 분리합니다.
- 팀 코드 컨벤션과 일관된 구조를 따릅니다.

#### 🌐 브라우저 호환성
- 최신 브라우저 및 주요 환경(Chrome, Safari, Edge, iOS, Android)에서 테스트합니다.
- CSS/JS 최신 문법을 사용하되, 필요한 경우 폴리필을 고려합니다.

#### ♿ 접근성
- ARIA 속성을 준수합니다.
- 키보드 내비게이션과 스크린리더 접근성을 보장합니다.
- 대비비율(WCAG 2.1 AA 이상)을 충족합니다.

---

✍️ **참고**  
본 규칙은 기수 변경 시에도 동일하게 적용되며, 필요에 따라 추가/수정될 수 있습니다.