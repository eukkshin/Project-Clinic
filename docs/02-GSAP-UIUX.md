# GSAP / ScrollTrigger 인터랙션 엔지니어링

> 면접에서 강조할 두 번째 기술 영역: **애니메이션의 완성도 + React 라이프사이클 안정성**

## 1. 애니메이션을 왜 선택했는가

이 프로젝트는 시술 정보가 많은 웹사이트에서도 브랜드 첫인상과 탐색 순서를 자연스럽게 연결하는 것을 목표로 했습니다. 정적인 CSS transition만으로 표현하기 어려운 **다중 요소 순차 등장, 타임라인 제어, 스크롤 구간에 연동된 고정/전환**에 GSAP/ScrollTrigger를 활용했습니다.

| 영역 | 의도 | 기술 포인트 |
| --- | --- | --- |
| Intro | 첫 방문의 브랜드 인지 | timeline, 재생 조건, Skip, 완료 이벤트 |
| Hero | 이미지·타이포그래피의 시선 흐름 | transform/opacity 타이밍, 초기 슬라이드 상태 |
| 스크롤 콘텐츠 | 시선의 순차적 이동 | ScrollTrigger, pin, start/end, cleanup |
| 섹션 경계 | 자연스러운 화면 전환 | 스크롤 위치/반응형 레이아웃 검토 |

## 2. React 훅과 DOM 참조

### `useRef`

애니메이션 타깃을 렌더링 과정에서 안정적으로 가리키기 위해 사용합니다. 예: `rootRef`, `titleRef`, `galleryRef`. GSAP 타임라인 자체도 ref로 보관해 `kill()`로 중단할 수 있습니다.

### `useEffect`와 정리(cleanup)

타임라인은 DOM이 브라우저에 존재해야 실행할 수 있습니다. 따라서 마운트 이후 effect에서 시작하고, 컴포넌트가 해제될 때 `kill()`/`revert()`로 DOM 변경과 이벤트 리스너를 정리해야 합니다. 배치 계산·핀과 관련된 경우 `useLayoutEffect`/isomorphic layout effect 사용의 적합성을 별도로 검토해야 합니다.

### `useState`

Intro가 실제로 표시되는지(`visible`), 타이핑이 시작됐는지(`typingStarted`)처럼 React UI의 조건부 출력에 영향을 주는 상태를 보관합니다. **DOM 변형 자체와 React 상태를 혼용할 때의 경계**를 주의해야 합니다.

### `useCallback`

`finish`/`exit`처럼 여러 effect와 이벤트 핸들러에서 공유하는 함수를 안정화해 불필요한 effect 재설정을 줄입니다. 모든 함수에 무조건 적용하는 것이 아니라 참조 안정성이 필요한 경우에 적용합니다.

## 3. Intro 동작의 실제 흐름

```text
초기 진입 조건 판단
  ↓
visible = true일 때 Overlay 렌더링
  ↓
GSAP timeline 생성
  ↓
브랜드/타이틀/갤러리/타이핑 순차 등장
  ↓
종료 시점 또는 Skip/Escape
  ↓
exit 타임라인 + 화면 비표시
  ↓
intro-finished 이벤트로 Hero 전환 신호
```

실제 기록에 `EXIT_AT = 2.3`, `TYPE_SPEED = 35`, `requestAnimationFrame`을 통한 종료 이벤트, `prefers-reduced-motion`, `Escape`, Skip이 포함됩니다. 숫자는 해당 공유 코드 시점의 값이며 후속 변경 여부는 저장소 기준으로 확인해야 합니다.

## 4. 중요한 트러블슈팅

### A. React 언마운트 중 `removeChild` 예외

`ScrollTrigger`의 `pin: true`는 DOM에 `pin-spacer` 래퍼를 삽입할 수 있습니다. React가 원래 노드 계층을 기준으로 언마운트하는 타이밍에 외부 코드의 DOM 조작이 겹치면 예외가 발생할 수 있어, GSAP 컨텍스트 및 트리거를 컴포넌트 해제 전에 정리하도록 검토했습니다. 같은 에러는 지도 SDK의 `replaceChildren()` 정리 방식도 후보였습니다. **실제 원인을 단일 요인으로 확정할 증거는 없으므로 경쟁 가설로 기록합니다.**

### B. Intro가 새로고침 시 번쩍였다가 사라짐

정적 export에서 `shouldPlay=true`로 HTML이 생성된 뒤, 클라이언트 `useEffect`가 `performance` 내비게이션 타입 `reload`를 감지해 `finish()`를 호출하면서 플래시가 나타났습니다. **화면 표시 조건을 effect 후가 아니라 초기 렌더링에서 제어**해야 한다는 교훈을 얻었습니다.

### C. Intro가 아예 재생되지 않음

초기 `visible=false`로 플래시는 막았지만, 진입 조건을 `document.referrer`의 외부 사이트 여부로만 판단했을 때 주소 직접 입력/북마크는 referrer가 비어 Intro가 실행되지 않았습니다. `PerformanceNavigationTiming.type`의 `navigate/reload/back_forward` 분기와 내부 라우팅 추적의 필요성을 검토했습니다. **최종 모든 이동 경로에서 완전 동작이 확인되었다고 단정하지 않습니다.**

### D. 서버 조건과 정적 export의 차이

원본 서버 렌더에서는 요청의 `referer`, `sec-fetch-site`, `sec-fetch-mode`로 외부 진입을 판별할 수 있었지만, `output: export`에서는 요청마다 `headers()`를 읽을 수 없습니다. 정적 모드 플래그를 이용해 서버 전용 경로를 분기한 다음 클라이언트용 기준이 필요해졌습니다.

## 5. UI/UX와 접근성 점검

- 진입 모션이 지나치게 길면 정보 탐색을 지연시킬 수 있어 Skip 제공
- `prefers-reduced-motion: reduce`를 존중하는 즉시 종료 경로
- Intro 실행 중 스크롤 잠금, 종료/언마운트 시 원래 overflow 복원
- 이벤트 리스너(`keydown`)와 타임라인 정리
- 애니메이션 도중 다른 라우트 이동 시 DOM 복구 검증
- 큰 이미지가 들어가는 Hero에서 로딩 및 레이아웃 안정성 고려

## 6. 면접에서 설명할 트레이드오프

**질문: CSS만으로 가능한데 왜 GSAP을 썼나요?**  
단일 hover/fade는 CSS가 적절합니다. 하지만 요소 간 순차 전개와 스크롤 위치에 대한 세밀한 제어, 취소·종료 조건 관리가 필요한 구간에는 타임라인 기반 GSAP을 선택했습니다.

**질문: React와 GSAP을 함께 쓸 때 가장 주의할 점은?**  
React가 DOM 생명주기를 관리하는 동안 GSAP이 스타일과 래퍼를 변경하므로, effect 생성과 cleanup을 대칭으로 작성하고 ScrollTrigger의 pin 복구 타이밍을 검증해야 합니다.

**질문: 가장 어려웠던 모션 버그는?**  
정적 사이트의 초기 HTML과 클라이언트 내비게이션 판단이 불일치할 때 Intro가 깜빡였던 문제입니다. 단순히 `finish()`를 빨리 호출하는 대신, 초기 표시 정책 자체를 재설계해야 한다는 것을 배웠습니다.
