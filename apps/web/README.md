# SURF Web

## Local HTTPS Setup

`surf-web`는 OAuth 콜백 검증 때문에 로컬에서도 `https://tavesurf.site` 오리진으로 실행합니다.
`dev` 스크립트는 443 포트와 `apps/web/tavesurf.site*.pem` 인증서를 사용합니다.

클라이언트 요청은 `/api/proxy`를 사용하지만, Server Component와 route handler에서 실행되는 서버 fetch는 `API_BASE_URL`로 백엔드를 직접 호출합니다. 서버 내부에서 `https://tavesurf.site/api/proxy`를 다시 호출하면 로컬 인증서와 443 포트 영향을 다시 받기 때문입니다.

### 1. mkcert 설치

```bash
brew install mkcert
brew install nss # Firefox 사용 시에만
mkcert -install
```

### 2. hosts 설정

`/etc/hosts`에 로컬 도메인을 추가합니다.

```bash
sudo vi /etc/hosts
```

```txt
127.0.0.1   tavesurf.site
```

적용 확인:

```bash
dscacheutil -q host -a name tavesurf.site
```

필요하면 DNS 캐시를 비웁니다.

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### 3. 인증서 생성

`apps/web` 디렉토리에서 실행합니다. 생성되는 `.pem` 파일은 gitignore 대상이라 각자 로컬에서 만들어야 합니다.

```bash
cd apps/web
mkcert tavesurf.site
```

아래 두 파일이 있어야 합니다.

```txt
tavesurf.site.pem
tavesurf.site-key.pem
```

검증:

```bash
openssl verify -CAfile "$(mkcert -CAROOT)/rootCA.pem" tavesurf.site.pem
openssl x509 -in tavesurf.site.pem -pubkey -noout | openssl sha256
openssl pkey -in tavesurf.site-key.pem -pubout | openssl sha256
```

`verify`는 `OK`, 두 sha256 값은 같아야 합니다.

### 4. 환경 변수

`apps/web/.env.local`에 로컬 앱 URL이 아래처럼 설정되어 있어야 합니다.

```env
NEXT_PUBLIC_APP_URL=https://tavesurf.site
```

### 5. 실행

루트에서 실행합니다.

```bash
pnpm dev:surf:local
```

이 스크립트는 Node 내부 `fetch()`가 mkcert 루트 CA를 신뢰하도록 `NODE_EXTRA_CA_CERTS`를 설정합니다.

443 포트 점유 확인:

```bash
lsof -nP -iTCP:443 -sTCP:LISTEN
```

443 포트 권한 문제로 실패하면 아래처럼 실행합니다.

```bash
sudo -E env "PATH=$PATH" NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem" pnpm dev:surf
```

정상 실행 후 브라우저에서 접속합니다.

```txt
https://tavesurf.site
```
