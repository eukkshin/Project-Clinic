"use client";

import { useState } from "react";

import * as S from "@/components/about/location/LocationFlat.styles";
import { FLAT_LOCATION } from "@/data/about/flatLocationData";

// 깊이나 입체 그림자 없이 모든 지도 형태를 HTML/SVG 벡터로 직접 구성합니다.
const buildings: Array<[number, number, number, number]> = [
  [53, 45, 80, 42],
  [149, 55, 63, 47],
  [236, 36, 100, 57],
  [370, 70, 55, 65],
  [449, 49, 100, 52],
  [582, 65, 96, 59],
  [697, 54, 70, 50],
  [858, 36, 73, 60],
  [60, 233, 76, 59],
  [150, 262, 90, 55],
  [245, 239, 49, 66],
  [340, 260, 78, 49],
  [476, 246, 61, 54],
  [559, 218, 67, 55],
  [736, 259, 75, 45],
  [844, 245, 78, 76],
  [57, 411, 95, 62],
  [160, 405, 54, 68],
  [240, 423, 78, 45],
  [410, 511, 67, 66],
  [531, 507, 75, 58],
  [661, 495, 74, 58],
  [772, 390, 63, 62],
  [886, 393, 65, 57],
  [52, 606, 84, 48],
  [388, 617, 85, 56],
  [517, 611, 85, 48],
  [737, 608, 68, 52],
  [883, 597, 66, 53],
];
const trees: Array<[number, number]> = [
  [744, 80],
  [762, 98],
  [796, 86],
  [850, 119],
  [902, 94],
  [923, 142],
  [841, 169],
  [798, 207],
  [100, 327],
  [125, 340],
  [94, 360],
  [164, 357],
  [193, 330],
  [76, 507],
  [97, 530],
  [128, 525],
  [690, 596],
  [720, 580],
  [768, 581],
  [712, 636],
  [805, 632],
  [953, 494],
];
const roads = [
  { d: "M-40 385 C180 346 373 407 551 363 S846 273 1040 321", w: 73 },
  { d: "M269 -35 C317 137 438 239 516 354 S686 584 748 728", w: 70 },
  { d: "M-50 170 C182 182 370 177 590 181 S820 158 1050 125", w: 38 },
  { d: "M-50 545 C174 522 364 561 533 532 S841 517 1060 559", w: 33 },
  { d: "M752 -40 C722 155 760 296 816 425 S848 606 883 740", w: 38 },
  { d: "M-60 670 C122 567 240 459 310 307 S384 81 450 -40", w: 37 },
];

export default function LocationFlatMap() {
  const [selectedId, setSelectedId] = useState<string>(
    FLAT_LOCATION.stations[0].id,
  );
  const active =
    FLAT_LOCATION.stations.find((item) => item.id === selectedId) ??
    FLAT_LOCATION.stations[0];

  return (
    <S.MapSection aria-label="AHN’S 주변 역 안내 일러스트 지도">
      <S.MapScroll tabIndex={0} aria-label="지도를 좌우로 살펴보기">
        <S.MapSurface>
          <S.CitySvg
            viewBox="0 0 1000 680"
            role="img"
            aria-label="노해로 주변을 단순한 건물 블록과 도로 선으로 표현한 추상 지도. 실제 지형과 다릅니다."
          >
            <rect width="1000" height="680" fill="#EEEFE7" />
            <path d="M710-20h290v261l-142 1-78-62-85-58Z" fill="#DCE5D8" />
            <path d="M-30 305L148 296l99 124-90 157L0 556Z" fill="#E1E8DD" />
            <path d="M623 582l142-31 124 99-2 64-293-5Z" fill="#DFE7D9" />
            {/* 얇은 보조 격자: 입체감 없이 평면 도형만 사용 */}
            <g stroke="#D7DAD0" strokeWidth="1" fill="none" opacity=".65">
              <path d="M0 112H1000M0 273H1000M0 440H1000M0 603H1000" />
              <path d="M138 0V680M338 0V680M549 0V680M788 0V680M935 0V680" />
            </g>
            {/* 도로의 윤곽선과 차도: 모든 길은 단색 두 레이어로 구현 */}
            {roads.map((road, i) => (
              <g
                key={i}
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <path d={road.d} stroke="#D8DCCF" strokeWidth={road.w + 5} />
                <path d={road.d} stroke="#FBFAF6" strokeWidth={road.w} />
                <path
                  d={road.d}
                  stroke="#DBD9CC"
                  strokeWidth="1.3"
                  strokeDasharray="5 13"
                />
              </g>
            ))}
            {/* 납작한 사각형 건물 */}
            {buildings.map(([x, y, w, h], i) => (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="3"
                  fill={
                    i % 4 === 0
                      ? "#D7DDD1"
                      : i % 3 === 0
                        ? "#E3E5DA"
                        : "#DCE0D5"
                  }
                  stroke="#CACFC4"
                  strokeWidth="1"
                />
                {w > 70 && (
                  <path
                    d={`M${x + 12} ${y + 12}H${x + w - 12}`}
                    stroke="#F6F7EF"
                    strokeWidth="2"
                    opacity=".8"
                  />
                )}
              </g>
            ))}
            {/* 공원은 작은 원형 나무로만 표시 */}
            {trees.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i % 3 === 0 ? 8 : 5.5}
                fill={i % 2 === 0 ? "#AFC1A5" : "#C3CFB8"}
                stroke="#96AD92"
                strokeWidth=".75"
              />
            ))}
            <g
              fill="#718475"
              fontFamily="Arial, sans-serif"
              fontSize="12"
              letterSpacing="1.4"
            >
              <text x="95" y="117">
                노원 문화의 거리
              </text>
              <text x="700" y="222">
                NOWON · SEOUL
              </text>
              <text x="767" y="682">
                LOCATION GUIDE
              </text>
              <text
                x="468"
                y="331"
                fontSize="11"
                transform="rotate(-13 468 331)"
              >
                노해로
              </text>
            </g>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path
                key={`${active.id}-base`}
                d={active.route}
                pathLength="1"
                stroke="#F8F7EC"
                strokeWidth="11"
                className="flat-route"
              />
              <path
                key={`${active.id}-draw`}
                d={active.route}
                pathLength="1"
                stroke="#B18D5E"
                strokeWidth="4"
                className="flat-route"
              />
              <path
                key={`${active.id}-dash`}
                d={active.route}
                pathLength="1"
                stroke="#FBF7E9"
                strokeWidth="1"
                strokeDasharray="2 9"
                className="flat-route-dash"
              />
            </g>
            <g transform="translate(620 355)">
              <circle r="34" fill="#A6BBA4" opacity=".4" />
              <circle r="18" fill="#1B3528" stroke="#F8F7EF" strokeWidth="5" />
              <circle r="4" fill="#F8F7EF" />
            </g>
          </S.CitySvg>
          <S.MapTopLabel>
            <span className="eyebrow">NEIGHBORHOOD MAP</span>
            <span className="fine">37° SEOUL / NOWON</span>
          </S.MapTopLabel>
          <S.Compass aria-hidden="true">
            N<span>↑</span>
          </S.Compass>
          <S.ClinicFlag style={{ left: "62%", top: "45.2%" }}>
            <span>AHN’S</span>
            <small>노해로 460</small>
          </S.ClinicFlag>
          {FLAT_LOCATION.stations.map((station) => (
            <S.StationMarker
              key={station.id}
              type="button"
              style={{
                left: `${station.x / 10}%`,
                top: `${station.y / 6.8}%`,
                ["--line-color" as string]: station.color,
              }}
              $active={station.id === selectedId}
              aria-label={`${station.name} ${station.line} 안내 선택`}
              aria-pressed={station.id === selectedId}
              onMouseEnter={() => setSelectedId(station.id)}
              onFocus={() => setSelectedId(station.id)}
              onClick={() => setSelectedId(station.id)}
            >
              <span className="number" aria-hidden="true">
                {station.number}
              </span>
              <span className="station-name">
                {station.name}
                <small>{station.line}</small>
              </span>
            </S.StationMarker>
          ))}
          <S.RouteCard aria-live="polite" aria-atomic="true">
            <span className="small">
              SELECTED STATION <i />
            </span>
            <strong>
              {active.name} <small>{active.line}</small>
            </strong>
            <div className="rule" />
            <div className="route-info">
              <span>도보</span>
              <b>{active.walkLabel}</b>
            </div>
            <div className="route-info">
              <span>차량</span>
              <b>지도에서 확인</b>
            </div>
          </S.RouteCard>
          <S.MapLegend>
            <i /> 그림으로 표현한 길 · 실제 경로와 다릅니다
          </S.MapLegend>
        </S.MapSurface>
      </S.MapScroll>
      <S.StationTabs aria-label="지도에서 역 선택">
        {FLAT_LOCATION.stations.map((station) => (
          <button
            key={station.id}
            type="button"
            aria-pressed={station.id === selectedId}
            onClick={() => setSelectedId(station.id)}
          >
            <i style={{ backgroundColor: station.color }} aria-hidden="true" />
            {station.name} <span>{station.line}</span>
          </button>
        ))}
      </S.StationTabs>
    </S.MapSection>
  );
}
