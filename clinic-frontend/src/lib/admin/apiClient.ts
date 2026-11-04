import axios from "axios";

/** 관리자 전용 요청: 사용자/일반 공개 API에는 전역 withCredentials를 설정하지 않습니다. */
const adminAxios = axios.create({
  withCredentials: true,
  timeout: 15000,
});

export default adminAxios;
