import axios, { AxiosInstance } from 'axios'
// import i18n from '@/i18n/i18n';
//SafeError 정의하기

const isLocalDev = 
    typeof window !== 'undefined' && 
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

const REDACTED = "[redacted]";

const SENSITIVE_KEY_PATTERN =
 /(authorization|cookie|set-cookie|token|secret|password|passphrase|api[-_]?key|refresh[-_]?token|access[-_]?token|id[-_]?token)/i;

const SENSITIVE_MESSAGE_PATTERN =
 /(exception|stack\s*trace|traceback|caused by:|org\.|java\.|jdbc|sql|at\s+\w+)/i;


 //순수 객체(Plain Object) 여부를 확인
const isPlainObject = (value:unknown): value is Record<string, unknown> =>{
    return typeof value === 'object' && value !== null && !Array.isArray(value);
 }

 //디버깅 로그 출력을 위해 민감한 데이터를 마스킹([redacted]) 처리하는 함수
 const sanitizeForLog = (value:unknown): unknown=>{
    if(Array.isArray(value)){
        return value.map((item)=> sanitizeForLog(item))
    }
    if(isPlainObject(value)){
        return Object.fromEntries(
            Object.entries(value).map(([key,item])=>[
                key,
                SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : sanitizeForLog(item),
            ]),
        );
    }
    return value;
 }

 //중첩된 객체 구조에서 특정 경로의 값을 안전하게 가져오는 함수
 const getNestedValue = (source:unknown, path: string[]): unknown=>{
    let current: unknown = source;
    for(const key of path){
        if(!isPlainObject(current)){
            return undefined;
        }
        current = current[key];
    }
    return current;
 }


 //서버 응답 데이터에서 사용자에게 보여줄 안전한 에러 메시지를 추출함수
 const pickDisplayMessage = (data: unknown, status?:number)=>{
    const candidates = [
        getNestedValue(data, ['messsage']),
        getNestedValue(data, ['result', 'errors','message']),
        getNestedValue(data, ["errors", "message"]),
    ];

    for (const candidate of candidates){
        if(typeof candidate !== 'string') continue;
        const trimmed = candidate.trim();
        if(!trimmed) continue;

        if(status && status >= 500) continue;
        if(SENSITIVE_MESSAGE_PATTERN.test(trimmed)) continue;
        if(trimmed.length >500) continue;
        return trimmed;
    }
    return "요청 처리 중 오류가 발생했습니다.";
 }

 //API 기본 URL(baseURL)을 정규화하는 함수
 const normalizeApiBaseURL = (value:string)=>{
    const trimmed = value.trim();
    if(!trimmed || trimmed === '/'){
        return "";
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")){
        return trimmed.replace(/\/+$/, "");
    }
    return (trimmed.startsWith('/') ? trimmed : `/${trimmed}`).replace(/\/+$/,"");
 }
const apiBaseURL = normalizeApiBaseURL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "");

const https: AxiosInstance = axios.create({
    baseURL: apiBaseURL,
    timeout: 15000,
    headers:{
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

//요청을 보내기 전 공통 헤더 설정
https.interceptors.request.use((config)=>{
    // const lang = (I18.language || 'ko').startsWith('en')
    // ? "en"
    // : "ko";
    config.headers = config.headers ?? {};

    if(config.data instanceof FormData){
        delete config.headers['Content-Type'];
    }    
    
    // config.headers['Accept-Language']= lang;
    return config;
})

//응답을 받거나 에러가 났을 때 공통 후처리
https.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const method = (error.config?.method || "GET").toUpperCase();
    const url = `${error.config?.baseURL || ""}${error.config?.url || ""}`;

    const requestHeaders = error.config?.headers ?? {};
    const responseHeaders = error.response?.headers ?? {};

    const requestParams = error.config?.params ?? {};
    const requestBody = error.config?.data ?? null;
    const responseBody = error.response?.data ?? null;

    // 401, 403 인증 관련 처리
    if (status === 401 || status === 403) {
      if (isLocalDev) {
        console.groupCollapsed(`[AUTH ${status}] ${method} ${url}`);

        console.log("Request Headers:", sanitizeForLog(requestHeaders));
        console.log("Request Params:", sanitizeForLog(requestParams));
        console.log("Request Body:", sanitizeForLog(requestBody));
        console.log("Response Headers:", sanitizeForLog(responseHeaders));
        console.log("Response Body:", sanitizeForLog(responseBody));

        console.groupEnd();
      }

      // 401일 때만 로그인 후 돌아갈 페이지 저장
      if (status === 401 && typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            "postLoginRedirect",
            `${window.location.pathname}${window.location.search}`,
          );
        } catch {
          // 스토리지 접근 오류 무시
        }
      }
    }

    // 공통 에러 메시지 처리
    const data = error.response?.data;

    const message = pickDisplayMessage(data, status);

    (error as SafeError).displayMessage = message;

    // 로컬 개발 환경에서 API 에러 출력
    if (isLocalDev) {
      console.error("[API Error]", {
        status,
        method,
        url,
        message,
        responseBody: sanitizeForLog(responseBody),
        responseHeaders: sanitizeForLog(responseHeaders),
      });
    }

    // 에러를 호출한 곳으로 전달
    return Promise.reject(error);
  },
);
