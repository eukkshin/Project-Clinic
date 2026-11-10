/**
 * AHN'S Location — 플랫 일러스트용 데이터
 * x/y 및 route는 실제 지도 좌표나 도로가 아닌 SVG상의 디자인 좌표입니다.
 * 주소 이전 시 이 파일의 address/floor/stations/path를 수정하면 됩니다.
 */
export type FlatStation = {
  id: string;
  name: string;
  line: string;
  number: string;
  color: string;
  x: number;
  y: number;
  route: string;
  walkLabel: string;
  travelNote: string;
};

export const FLAT_LOCATION = {
  clinicName: "AHN’S",
  address: "서울특별시 노원구 노해로 460 (상계동)",
  floor: "2층 201호",
  stationCaption: "방문 경로는 카카오맵에서 확인해 주세요.",
  stations: [
    {
      id: "nowon7",
      name: "노원역",
      line: "7호선",
      number: "7",
      color: "#748947",
      x: 362,
      y: 471,
      route: "M362 471 C415 466 452 429 478 404 S565 350 620 355",
      walkLabel: "도보 약 3분",
      travelNote: "7호선 노원역 인근 · 출구에 따라 차이",
    },
    {
      id: "nowon4",
      name: "노원역",
      line: "4호선",
      number: "4",
      color: "#3481AF",
      x: 242,
      y: 578,
      route: "M242 578 C345 553 387 520 448 462 S548 381 620 355",
      walkLabel: "실제 경로 확인",
      travelNote: "4호선 노원역에서 이동",
    },
    {
      id: "junggye7",
      name: "중계역",
      line: "7호선",
      number: "7",
      color: "#748947",
      x: 801,
      y: 147,
      route: "M801 147 C749 194 741 251 710 285 S657 336 620 355",
      walkLabel: "실제 경로 확인",
      travelNote: "7호선 중계역에서 이동",
    },
    {
      id: "sangye4",
      name: "상계역",
      line: "4호선",
      number: "4",
      color: "#3481AF",
      x: 830,
      y: 538,
      route: "M830 538 C792 490 743 472 706 438 S658 371 620 355",
      walkLabel: "실제 경로 확인",
      travelNote: "4호선 상계역에서 이동",
    },
  ] satisfies FlatStation[],
} as const;

export const flatFullAddress = `${FLAT_LOCATION.address} ${FLAT_LOCATION.floor}`;
export const flatKakaoUrl = `https://map.kakao.com/link/search/${encodeURIComponent(flatFullAddress)}`;
export const flatNaverUrl = `https://map.naver.com/p/search/${encodeURIComponent(flatFullAddress)}`;
