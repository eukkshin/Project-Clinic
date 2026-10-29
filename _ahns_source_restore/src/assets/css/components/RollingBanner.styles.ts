import styled, { keyframes } from "styled-components";

/*
 * marquee 애니메이션
 *
 * 배너의 텍스트 전체를 왼쪽으로 이동시킨다.
 *
 * 0%: 원래 위치에서 시작
 * 100%: 전체 너비의 절반만큼 왼쪽으로 이동
 *
 * 같은 그룹이 2개이기 때문에 -50%만 이동하면
 * 두 번째 그룹이 첫 번째 그룹의 자리를 차지한다.
 *
 * 따라서 애니메이션이 처음으로 돌아와도
 * 움직임이 끊기는 느낌이 거의 없다.
 */
const marquee = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
`;

/*
 * 배너 전체 영역
 *
 * 기존 검은색 배경을 제거했다.
 * Hero 이미지 위에 텍스트만 나타나도록 한다.
 */
export const BannerWrapper = styled.div`
  position: relative;

  width: 100%;
  overflow: hidden;

  padding: 14px 0;

  background: transparent;

  /* Hero 이미지가 어두워도, 밝아도 글자가 구분되도록 */
  color: #f8f7f2;

  pointer-events: none;

  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;

/*
 * 실제로 좌우로 움직이는 요소
 *
 * 자식으로 들어오는 텍스트 그룹 2개를
 * 가로 방향으로 나란히 배치한다.
 */
export const Track = styled.div`
  display: flex;

  /* 자식 요소의 실제 너비만큼 Track이 늘어나도록 */
  width: max-content;

  /* 45초 동안 천천히 한 번 이동한다. */
  animation: ${marquee} 45s linear infinite;

  will-change: transform;

  /*
   * 사용자가 운영체제에서 움직임 감소를 설정한 경우
   * 움직이는 애니메이션을 제거한다.
   */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    will-change: auto;
  }
`;

/*
 * 반복되는 텍스트 그룹 하나
 *
 * min-width: 100vw를 사용해
 * PC에서도 글자가 너무 적게 보여서
 * 중간에 빈 공간이 생기는 현상을 줄인다.
 */
export const TextGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  flex: 0 0 auto;
  min-width: 100vw;
`;

/*
 * 브랜드 텍스트와 작은 장식을 묶는 영역
 */
export const TextItem = styled.div`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;

  gap: clamp(14px, 2vw, 30px);
  padding: 0 clamp(20px, 3vw, 48px);
`;

/*
 * 실제 브랜드 글씨
 *
 * font-family: inherit
 * → 홈페이지의 상위 요소에서 설정한 글꼴을 물려받는다.
 *
 * 기존 Arial을 제거했기 때문에
 * 사이트에 적용된 공통 폰트를 그대로 사용한다.
 */
export const Text = styled.span`
  font-family: inherit;

  /* 기존보다 작고 섬세한 글씨 */
  font-size: clamp(12px, 1.05vw, 15px);

  /* 기존 800에서 400으로 변경해 훨씬 얇게 */
  font-weight: 400;

  line-height: 1.5;

  /* 영문 글자 사이에 여유를 주어 고급스럽게 보이도록 */
  letter-spacing: 0.16em;

  white-space: nowrap;

  color: #f8f7f2;

  /*
   * 모델 사진과 텍스트가 겹쳐도
   * 어느 정도 가독성을 유지할 수 있도록
   * 아주 약한 그림자만 사용한다.
   */
  text-shadow: 0 2px 12px rgba(23, 41, 29, 0.3);

  @media (max-width: 768px) {
    font-size: 11px;
    letter-spacing: 0.12em;
  }
`;

/*
 * 텍스트 사이에 들어가는 작은 장식
 *
 * 기존 큰 분홍색 점 대신
 * 아이보리 계열의 작은 별 모양으로 변경한다.
 */
export const Decoration = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 300;

  line-height: 1;

  color: #e6e5d7;

  opacity: 0.85;

  @media (max-width: 768px) {
    font-size: 9px;
  }
`;
