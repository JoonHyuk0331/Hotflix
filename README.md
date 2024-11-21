# HotflixDev 프로젝트
![화면 캡처 2024-11-21 142514](https://github.com/user-attachments/assets/c3c15b6c-93d3-4e07-bbe0-c5979ec104e2)
## 1. 프로젝트 개요

**HotflixDev**는 영화 관련 웹 애플리케이션으로, 사용자가 다양한 영화 기능을 탐색하고 관리할 수 있습니다. 최신 영화, 인기 영화 등 다양한 영화 정보를 제공하며, 사용자는 자신만의 영화 위시리스트를 만들고, 영화 필터링 기능을 통해 원하는 영화를 찾아볼 수 있습니다.

### 주요 기능:
- **로그인/회원가입**: 사용자는 계정을 생성하고 로그인할 수 있습니다. 데이터는 로컬 스토리지를 사용하여 관리됩니다.
- **최신 영화 리스트**: 최신 영화 목록을 확인할 수 있습니다.
- **인기 영화 리스트**: 현재 인기 있는 영화 목록을 확인할 수 있습니다.
- **영화 검색**: 영화 제목으로 영화를 검색할 수 있습니다.
- **영화 찾기**: 제목이나 장르로 영화를 찾을 수 있습니다.
- **위시리스트 기능**: 사용자는 영화를 개인 위시리스트에 추가할 수 있습니다.
- **영화 필터링**: 장르, 개봉일 등을 기준으로 영화를 필터링하여 볼 수 있습니다.

## 2. 기술 스택

- **React**: UI 구성 및 컴포넌트 관리
- **React Router**: 애플리케이션 내 라우팅 관리
- **CSS**: 컴포넌트 스타일링
- **JavaScript**: 애플리케이션의 주요 로직 구현

## 3. 설치 및 실행 가이드

### 사전 준비 사항:
- `node_modules`가 포함되어 있는지 확인하세요. 없다면 `npm install` 또는 `yarn install`을 실행하여 의존성을 설치할 수 있습니다.
- **TMDB API 키**가 필요합니다. 회원가입 시 이 API 키를 비밀번호로 입력해야 합니다.

### 프로젝트 실행 방법:
  1. 리포지토리를 클론합니다:
     ```bash
     git clone <repository_url>
     cd HotflixDev```
  2. 필요한 의존성을 설치합니다
  ```npm install```
  3. ⚠중요⚠ lucide-react 라이브러리 설치
  ```npm install lucide-react```
  4. 개발 서버를 실행합니다
  ```npm start```

## 4. 프로젝트 폴더 구조
```
HotflixDev
└─ hotflix
   ├─ build                    # 빌드된 파일 (프로덕션용)
   │  ├─ asset-manifest.json    # 정적 자산 목록
   │  ├─ index.html             # 프로덕션용 HTML 진입점
   │  └─ static
   │     ├─ css
   │     │  ├─ main.2d95e2c6.css
   │     │  └─ main.2d95e2c6.css.map
   │     ├─ js
   │     │  ├─ 453.5b9f091a.chunk.js
   │     │  ├─ 453.5b9f091a.chunk.js.map
   │     │  ├─ main.0f7a6137.js
   │     │  ├─ main.0f7a6137.js.LICENSE.txt
   │     │  └─ main.0f7a6137.js.map
   │     └─ media
   │        └─ HotflixLogo.1faa18df6c15d63bce29.jpg
   ├─ package-lock.json        # npm 의존성 잠금 파일
   ├─ package.json             # 프로젝트 메타데이터 및 의존성
   ├─ public
   │  └─ index.html            # 애플리케이션의 메인 HTML 파일
   ├─ README.md                # 프로젝트 설명서
   └─ src
      ├─ App.css               # 전역 CSS
      ├─ App.js                # 메인 애플리케이션 컴포넌트
      ├─ components            # React 컴포넌트들
      │  ├─ Login.jsx          # 로그인 컴포넌트
      │  ├─ Main.jsx           # 메인 페이지 컴포넌트
      │  ├─ Movie.jsx          # 개별 영화 컴포넌트
      │  ├─ Popular.jsx        # 인기 영화 컴포넌트
      │  ├─ Search.jsx         # 영화 검색 컴포넌트
      │  └─ Wishlist.jsx       # 위시리스트 컴포넌트
      ├─ img
      │  └─ HotflixLogo.jpg    # 로고 이미지
      ├─ index.css             # 전역 스타일
      ├─ index.js              # React 앱 진입점
      └─ reportWebVitals.js    # 성능 보고 설정
```
## 5. gitflow 전략 적용
![화면 캡처 2024-11-21 142254](https://github.com/user-attachments/assets/d5e5a2bf-b49e-42c6-87ef-692fe8cb09cb)
