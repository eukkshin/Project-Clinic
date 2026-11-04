-- AHNS 로그인 세션 버전과 회원 서비스 탈퇴 기록 (Oracle 19c / XE)
-- 회원가입/동의 이력 패치 적용 이후 실행하십시오.
-- 실행 전 운영 DB 백업, 실제 컬럼/제약 확인 및 유지보수 승인 필요.
-- 이미 존재하는 컬럼이 있으면 해당 ALTER 구문은 다시 실행하지 마십시오.

ALTER TABLE MEMBER_TB ADD (
  SESSION_VERSION NUMBER DEFAULT 0 NOT NULL,
  WITHDRAWN_AT TIMESTAMP NULL
);

-- 점검용 조회(SELECT만 실행)
-- SELECT USER_IDX, USER_ID, STATUS, SESSION_VERSION, WITHDRAWN_AT
-- FROM MEMBER_TB ORDER BY USER_IDX DESC;

-- [중요] 이 배포 이후 기존 JWT는 sv 값이 없어서 재로그인이 필요합니다.
-- 이 스키마 변경은 회원 개인정보의 파기 또는 의료기록 보존정책을 대신하지 않습니다.
