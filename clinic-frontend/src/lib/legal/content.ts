import type { AppLocale } from "@/i18n/config";

/**
 * 법적 안내 페이지 본문 초안: 일반적인 고지 구조와 조항을 작성한 내용입니다.
 * 병원별 수집 항목, 보유 기간, 위탁업체, 책임자, 비급여 금액 등은 [확인 필요: ...]로 표시합니다.
 * 배포 전에 실제 처리 현황과 일치시키고 최종 검토해야 합니다.
 */
export type LegalKind =
  | "privacy"
  | "terms"
  | "non-covered-fees"
  | "patient-rights"
  | "reservation-policy";
export type LegalSection = { heading: string; body: string };
export type LegalDocument = {
  title: string;
  lead: string;
  sections: LegalSection[];
};

export const legalPaths: Record<LegalKind, string> = {
  privacy: "/privacy",
  terms: "/terms",
  "non-covered-fees": "/non-covered-fees",
  "patient-rights": "/patient-rights",
  "reservation-policy": "/reservation-policy",
};

export const legalKinds: LegalKind[] = [
  "privacy",
  "terms",
  "non-covered-fees",
  "patient-rights",
  "reservation-policy",
];

export const legalUi: Record<
  AppLocale,
  {
    nav: Record<LegalKind, string>;
    subtitle: string;
    draft: string;
    draftDescription: string;
    reviewRequired: string;
    backHome: string;
    noPrices: string;
  }
> = {
  ko: {
    nav: {
      privacy: "개인정보처리방침",
      terms: "이용약관",
      "non-covered-fees": "비급여 진료비용",
      "patient-rights": "환자의 권리와 의무",
      "reservation-policy": "예약·취소 안내",
    },
    subtitle: "PATIENT INFORMATION & POLICIES",
    draft: "일반 조항 작성본 · 운영 전 확인 필요",
    draftDescription:
      "일반적인 조항을 작성한 검토용 본문입니다. 실제 병원 운영 정보가 확정된 최종 고지문은 아닙니다.",
    reviewRequired:
      "표시된 [확인 필요] 항목과 실제 수집·예약·결제 운영을 대조하고, 관련 담당자 검토 후 게시해 주세요.",
    backHome: "메인으로 돌아가기",
    noPrices:
      "※ 실제 병원에서 징수하는 비급여 진료비와 제증명수수료의 항목·금액이 제공되지 않았습니다. [확인 필요: 항목별 금액표]를 입력하기 전에는 법정 비용 고지가 완료된 상태가 아닙니다.",
  },
  en: {
    nav: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      "non-covered-fees": "Non-Covered Fees",
      "patient-rights": "Patient Rights",
      "reservation-policy": "Booking & Cancellation",
    },
    subtitle: "PATIENT INFORMATION & POLICIES",
    draft: "Draft clauses · verification required",
    draftDescription:
      "This draft contains standard clauses, but it is not yet verified against actual clinic operations.",
    reviewRequired:
      "Replace each [VERIFY] field and review all clauses against actual data handling, policies, and fees before publication.",
    backHome: "Back to home",
    noPrices:
      "No approved fee schedule is available. The clinic must publish its actual non-covered fees and certificate charges.",
  },
  ja: {
    nav: {
      privacy: "個人情報処理方針",
      terms: "利用規約",
      "non-covered-fees": "自由診療料金",
      "patient-rights": "患者の権利と義務",
      "reservation-policy": "予約・キャンセル",
    },
    subtitle: "PATIENT INFORMATION & POLICIES",
    draft: "条項案 · 公開前要確認",
    draftDescription:
      "一般的な条項を記載した草案です。実際の病院の運用と照合した正式な告知ではありません。",
    reviewRequired:
      "［要確認］項目と実際の取扱情報、保存期間、委託先、料金などを確認してから公開してください。",
    backHome: "トップページへ戻る",
    noPrices:
      "承認済みの料金表は未登録です。実際の自由診療料金と証明書発行手数料の掲載が必要です。",
  },
  "zh-CN": {
    nav: {
      privacy: "隐私政策",
      terms: "使用条款",
      "non-covered-fees": "非医保收费",
      "patient-rights": "患者权利与义务",
      "reservation-policy": "预约与取消",
    },
    subtitle: "PATIENT INFORMATION & POLICIES",
    draft: "条款草案 · 上线前核实",
    draftDescription:
      "本草案包含常见条款，但尚未与医院实际运营情况核实，不能视为已批准的正式公告。",
    reviewRequired:
      "发布前请补全【待核实】内容，并确认实际数据处理、保存期限、服务商及收费。",
    backHome: "返回首页",
    noPrices:
      "尚未录入审核通过的收费表。须公布实际的非医保诊疗费用及证明文件费用。",
  },
  "zh-TW": {
    nav: {
      privacy: "隱私權政策",
      terms: "使用條款",
      "non-covered-fees": "非健保收費",
      "patient-rights": "患者權利與義務",
      "reservation-policy": "預約與取消",
    },
    subtitle: "PATIENT INFORMATION & POLICIES",
    draft: "條款草案 · 上線前確認",
    draftDescription:
      "本草案包含一般條款，但尚未與院所實際營運核實，不能視為正式核准的公告。",
    reviewRequired:
      "發布前請補全【待確認】內容，並核實實際資料處理、保存期間、服務商與收費。",
    backHome: "返回首頁",
    noPrices:
      "尚未登錄經審核的收費表。須公告實際的非健保診療費用及證明文件費用。",
  },
};

// 5개 언어 × 5개 안내 문서의 일반 조항을 작성한 검토용 본문.
// [확인 필요] 및 번역문의 법적 의미는 실제 병원 운영·법무 검토를 거쳐야 합니다.
export const legalContent: Record<
  AppLocale,
  Record<LegalKind, LegalDocument>
> = {
  ko: {
    privacy: {
      title: "개인정보처리방침",
      lead: "안스성형외과(이하 “의료기관”)는 개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고, 정보주체의 권리를 보장하기 위하여 다음과 같이 개인정보 처리방침을 마련합니다. 이 문서는 일반 조항 작성본으로, [확인 필요] 부분은 실제 운영정보로 교체하여야 합니다.",
      sections: [
        {
          heading: "제1조 개인정보처리자 및 적용 범위",
          body: "이 방침은 의료기관의 홈페이지, 회원가입, 상담 신청, 방문 예약, 고객 문의 등 온라인 서비스에서 처리하는 개인정보에 적용됩니다. 의료기관의 정확한 개설자·법적 명칭: [확인 필요: 사업자·의료기관 등록상 명칭]. 진료기록 등 오프라인 의료정보는 관계 법령과 의료기관의 별도 안내에 따라 관리될 수 있습니다.",
        },
        {
          heading: "제2조 개인정보 처리 목적 및 근거",
          body: "① 회원 관리: 가입 의사 확인, 계정 식별·인증, 부정 이용 방지, 회원 민원 처리 등 서비스 제공에 필요한 범위에서 처리합니다.\n② 방문 상담 예약: 신청자 확인, 예약 시간 배정·변경·취소 및 필요한 안내를 위해 처리합니다.\n③ 온라인 문의·상담: 문의 내용 확인, 답변 및 후속 안내를 위해 처리합니다.\n④ 서비스 안전과 운영: 접근 기록, 보안 사고 대응, 시스템 장애 확인에 필요한 범위에서 처리합니다.\n⑤ 이벤트·광고 발송은 별도 동의 등 적법한 근거가 있는 경우에 한하여 처리합니다.\n목적별 법적 근거(계약 이행, 동의, 법률상 의무 등)는 실제 수집 화면·업무와 일치하게 확정합니다. [확인 필요: 항목별 법적 근거]",
        },
        {
          heading: "제3조 처리하는 개인정보의 항목",
          body: "① 회원가입: 이름, 아이디, 비밀번호(암호화된 값), 이메일, 휴대전화번호 등 [확인 필요: 실제 필수·선택 필드].\n② 예약: 회원 식별정보, 예약 날짜·시간, 상담 분야 및 예약 관련 연락정보 등 [확인 필요: 실제 DB 필드].\n③ 문의·상담: 성명 또는 닉네임, 연락처, 문의 내용 및 이용자가 직접 작성한 정보 등 [확인 필요: 실제 입력항목].\n④ 이용 과정: 접속 IP, 접속 일시, 쿠키·기기·접속 기록 등 실제 생성·수집되는 항목 [확인 필요: 로그 및 분석 도구].\n선택 정보는 반드시 목적과 필요성을 검토하며, 홈페이지 일반 회원가입에서 법적 근거 없는 주민등록번호 수집은 하지 않도록 수정해야 합니다.",
        },
        {
          heading: "제4조 민감정보 및 아동의 개인정보",
          body: "건강 상태, 과거 시술·수술 이력, 질환, 복용 약물, 환부 사진 등 건강 관련 정보는 민감정보에 해당할 수 있습니다. 법령에서 허용하거나 필요한 별도 동의 등을 갖춘 경우에만 최소한으로 처리합니다. 일반 회원가입의 선택 동의가 진료 관련 민감정보 처리 근거를 대체하지 않습니다.\n만 14세 미만 아동의 개인정보 처리에 법정대리인 동의가 필요한 경우에는 동의 및 법정대리인 확인 절차를 마련합니다. [확인 필요: 실제 가입 연령 정책]",
        },
        {
          heading: "제5조 개인정보 보유 및 이용 기간",
          body: "개인정보는 수집·이용 목적을 달성할 때까지 보유하며, 법령상 보존 의무가 있는 경우 해당 기간 동안 별도로 보관합니다.\n① 회원정보: 회원 탈퇴 또는 회원관리 목적 종료 시까지를 원칙으로 하되, 법령에 따라 보존이 필요한 정보는 분리 보관합니다. [확인 필요: 회원 탈퇴 및 부정 이용 방지 보유 정책]\n② 예약·문의·상담정보: 업무 목적 완료 후 실제 보유 정책에 따라 파기합니다. [확인 필요: 각각의 보유 기간]\n③ 진료기록 등 법정 보존 대상: 의료법 등 관련 법령에서 정한 기간을 따릅니다.\n④ 서비스 접속기록 및 광고 수신 동의 이력: [확인 필요: 수집 여부·보유 기간·법적 근거].",
        },
        {
          heading: "제6조 개인정보 제3자 제공",
          body: "의료기관은 정보주체의 별도 동의가 있거나 법률에서 허용하는 경우 등 적법한 근거 없이 개인정보를 제3자에게 제공하지 않습니다. 제3자 제공이 있는 경우 제공받는 자, 목적, 항목, 보유 기간, 거부에 따른 영향 등을 관련 법령에 따라 안내합니다. [확인 필요: 실제 제3자 제공 여부·수령자 목록]",
        },
        {
          heading: "제7조 개인정보 처리업무의 위탁",
          body: "홈페이지 호스팅, 시스템 운영, 문자·알림 발송, 이메일 발송, 예약 관리 등 외부 업체에 개인정보 처리업무를 위탁하는 경우 수탁자와 위탁 업무를 공개하고 법령에 따른 관리·감독을 실시합니다.\n[확인 필요: 실제 수탁업체명 / 위탁업무 / 재위탁 여부 및 공개 방식]\n실제 위탁이 없는 항목은 운영 현황에 맞춰 삭제합니다.",
        },
        {
          heading: "제8조 개인정보의 국외 이전",
          body: "해외 클라우드·분석 도구·메일 발송 서비스 등으로 개인정보를 이전하는 경우, 관련 법령에서 요구하는 이전 근거, 이전 국가·시점·방법, 이전 항목, 받는 자, 이용 목적 및 보유 기간, 이전 거부 방법 등을 고지합니다. [확인 필요: 국외 이전 여부 및 해당 업체·국가]\n해당 사항이 없는 경우에는 “국외 이전 없음”으로 실제 현황을 확인한 뒤 기재합니다.",
        },
        {
          heading: "제9조 개인정보 파기 절차 및 방법",
          body: "개인정보 보유 기간이 경과하거나 처리 목적이 달성되어 불필요해진 경우 지체 없이 파기합니다. 다만 법령에 따라 보존해야 하는 정보는 별도 분리하여 보관합니다. 전자적 파일은 복구·재생이 어렵도록 안전하게 삭제하고, 종이 문서는 파쇄 또는 소각 등 적절한 방법으로 파기합니다.",
        },
        {
          heading: "제10조 개인정보 안전성 확보 조치",
          body: "의료기관은 접근 권한의 최소화 및 관리, 비밀번호 등 인증정보 보호, 전송 구간 암호화, 접속기록 관리, 보안 업데이트, 악성코드 대응, 직원 보안교육, 물리적 접근 통제 등 개인정보의 위험에 상응하는 보호조치를 시행합니다. 구체적인 운영조치는 실제 시스템 점검 결과에 따라 확정합니다.",
        },
        {
          heading: "제11조 정보주체의 권리와 행사 방법",
          body: "이용자는 관련 법령에서 정하는 범위에서 개인정보 열람·정정·삭제·처리정지·동의 철회 등을 요청할 수 있습니다. 본인 또는 적법한 대리인이 [확인 필요: 담당 이메일·전화·접수 방법]을 통해 신청할 수 있으며, 의료기관은 요청자 확인 후 법령에서 정한 절차에 따라 처리합니다. 의료기록 등 법령상 보존 의무가 있는 정보는 삭제 요청이 제한될 수 있습니다.",
        },
        {
          heading: "제12조 쿠키 및 자동 수집 장치",
          body: "사이트는 로그인 상태 유지 및 선택한 언어 저장 등을 위하여 쿠키를 사용할 수 있습니다. 브라우저 설정에서 쿠키를 삭제·차단할 수 있으나, 로그인·언어 설정 등 일부 기능 이용에 제한이 발생할 수 있습니다.\n[확인 필요: 사용 중인 쿠키명·목적·보유 기간 / 방문 분석·광고 추적 도구·행태정보 수집 여부]",
        },
        {
          heading: "제13조 추가적 이용·제공 및 자동화된 결정",
          body: "수집 목적과 합리적으로 관련된 범위에서 법령이 허용하는 추가 이용·제공을 하는 경우 관련 기준과 보호조치를 검토합니다. 개인에게 중대한 영향을 미치는 자동화된 결정 등 해당 기능을 운영한다면 관련 정보와 권리 행사 방법을 별도로 안내합니다. [확인 필요: 실제 해당 기능 사용 여부]",
        },
        {
          heading: "제14조 개인정보 보호책임자 및 문의",
          body: "개인정보 처리에 관한 문의, 불만 처리, 피해 구제 요청은 아래 연락처로 접수할 수 있습니다.\n개인정보 보호책임자: [확인 필요: 성명·직책]\n담당 부서: [확인 필요: 담당 부서]\n이메일: [확인 필요: 실제 연락 이메일]\n전화번호: [확인 필요: 실제 연락처]\n개인정보 침해에 대한 상담은 개인정보침해신고센터(국번 없이 118) 등 관계기관에 문의할 수 있습니다.",
        },
        {
          heading: "제15조 방침 시행일 및 변경 고지",
          body: "본 방침 시행일: [확인 필요: 실제 최초 시행일]. 변경 시 홈페이지에 개정 내용과 시행일을 안내하며, 관련 법령에 따라 별도 통지가 필요한 경우 적절한 방법으로 알립니다. 이전 버전 열람 방법: [확인 필요: 변경 이력 제공 위치].",
        },
      ],
    },
    terms: {
      title: "서비스 이용약관",
      lead: "본 약관은 안스성형외과 홈페이지가 제공하는 회원 서비스, 상담 신청 및 방문 예약 서비스의 이용 조건과 이용자·의료기관 간 권리와 의무에 관한 일반 사항을 정합니다. 실제 운영에 맞게 확정하기 전까지 검토용 문안입니다.",
      sections: [
        {
          heading: "제1조 목적",
          body: "이 약관은 안스성형외과(이하 “의료기관”)가 운영하는 홈페이지와 관련 온라인 서비스의 이용에 필요한 기본적인 사항을 정함을 목적으로 합니다. 의료기관의 정확한 법적 명칭·연락처: [확인 필요: 등록정보].",
        },
        {
          heading: "제2조 용어의 정의",
          body: "① “서비스”란 홈페이지, 회원계정, 상담 문의, 방문 예약, 예약 내역 확인 등 온라인에서 제공되는 기능을 말합니다.\n② “회원”이란 정해진 가입 절차에 따라 계정을 생성한 이용자를 말합니다.\n③ “예약”이란 상담 방문 시간의 신청 및 확인을 말하며, 진료·시술·수술의 확정이나 효과의 보장을 의미하지 않습니다.",
        },
        {
          heading: "제3조 약관의 게시 및 변경",
          body: "의료기관은 약관을 홈페이지에서 쉽게 확인할 수 있도록 게시합니다. 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경된 내용과 시행일을 이용자가 확인할 수 있도록 사전에 안내합니다. 중요한 변경 사항은 필요한 경우 개별적으로 알립니다.",
        },
        {
          heading: "제4조 서비스 제공 및 변경",
          body: "의료기관은 병원·진료 분야 소개, 온라인 회원관리, 예약·상담 신청, 공지사항 등의 기능을 제공합니다. 의료기관의 운영 사정, 설비 점검, 보안 사고 등으로 서비스의 전부 또는 일부가 일시 중단될 수 있으며, 가능한 범위에서 사유와 일정을 안내합니다.",
        },
        {
          heading: "제5조 회원가입 및 계정 관리",
          body: "가입을 희망하는 이용자는 정확한 정보를 입력하고 필요한 약관·개인정보 관련 절차를 완료해야 합니다. 의료기관은 시스템 보호, 부정 이용 방지 등 합리적 사유가 있는 경우 가입 또는 이용을 제한할 수 있으며 그 사유를 안내합니다. 계정·비밀번호는 타인과 공유해서는 안 됩니다.",
        },
        {
          heading: "제6조 미성년자 및 법정대리인",
          body: "연령에 따라 법정대리인의 동의·확인 등이 요구되는 경우 관련 법령에 따라 절차를 진행합니다. 회원가입과 의료행위에 대한 설명·동의는 별개의 절차이며, 시술·수술 동의는 의료진이 관련 법령에 따라 안내합니다.",
        },
        {
          heading: "제7조 회원정보 변경 및 탈퇴",
          body: "회원은 제공된 기능 또는 고객 지원 창구를 통해 계정 정보의 변경이나 탈퇴를 요청할 수 있습니다. 탈퇴 후 개인정보는 개인정보처리방침에 따라 처리하되, 관계 법령상 보존이 필요한 정보는 해당 기간 동안 분리하여 관리합니다.",
        },
        {
          heading: "제8조 온라인 예약 및 상담",
          body: "온라인 예약은 방문 상담 일정의 예약 기능입니다. 이용자가 가능한 날짜와 시간을 선택하면 시스템에 표시된 상태에 따라 예약이 처리되며, 상세 상태는 마이페이지에서 확인합니다. 실제 진료 가능 여부, 의학적 적합성, 치료 계획 및 비용은 방문 상담 후 결정됩니다. 예약과 취소의 구체적 절차는 별도의 예약·취소 안내를 따릅니다.",
        },
        {
          heading: "제9조 진료정보 및 의료행위",
          body: "홈페이지의 시술 설명과 일반 건강 정보는 참고용이며 개인별 진단이나 진료를 대신하지 않습니다. 수술 방법, 부작용, 회복 과정, 비용 등은 개별 상담을 통해 설명받고 판단해야 합니다. 응급 상황에서는 홈페이지 상담을 기다리지 말고 즉시 적절한 응급 의료서비스를 이용해야 합니다.",
        },
        {
          heading: "제10조 이용자의 의무",
          body: "회원은 정확한 계정·예약 정보를 제공하고, 다른 사람의 계정을 도용하거나 개인정보를 침해해서는 안 됩니다. 허위 예약, 광고성 게시물, 악성 프로그램 전송, 서비스 방해, 저작권 침해 등 위법하거나 부적절한 행위를 하지 않아야 합니다.",
        },
        {
          heading: "제11조 서비스 이용 제한",
          body: "의료기관은 관련 법령 위반, 계정 도용, 반복적인 업무 방해, 보안 위험 등 정당한 사유가 있는 경우 필요한 범위에서 이용을 제한할 수 있습니다. 다만 법령상 긴급한 조치가 아닌 경우 가능한 한 사유와 이의제기 방법을 안내합니다.",
        },
        {
          heading: "제12조 게시물 및 지식재산권",
          body: "홈페이지의 글·디자인·사진·상표 등의 권리는 정당한 권리자에게 귀속됩니다. 이용자는 권리자 동의 없이 이를 무단 복제·배포할 수 없습니다. 후기·사진을 게시할 경우 본인 또는 제3자의 권리를 침해하지 않아야 하며, 환자 사진과 의료정보 공개에는 별도 적법한 동의 및 의료광고 규정 준수가 필요합니다.",
        },
        {
          heading: "제13조 개인정보 보호",
          body: "회원정보와 예약·상담정보는 개인정보처리방침 및 관련 법령에 따라 처리합니다. 마케팅 정보 발송은 별도 동의 등 적법한 근거에 따라 진행하며, 동의 철회 경로를 제공합니다.",
        },
        {
          heading: "제14조 책임 및 분쟁 처리",
          body: "의료기관과 이용자는 각자 관련 법령 및 약관을 준수해야 합니다. 의료기관은 법령상 책임을 임의로 배제하지 않으며, 이용자 문의와 불만은 [확인 필요: 고객지원 창구]를 통해 접수합니다. 분쟁이 발생한 경우 관계 법령과 정당한 절차에 따라 해결합니다.",
        },
        {
          heading: "부칙 시행일",
          body: "본 약관 시행일: [확인 필요: 시행일]. 이전 약관 및 변경 이력: [확인 필요: 이력 페이지].",
        },
      ],
    },
    "non-covered-fees": {
      title: "비급여 진료비용 및 제증명수수료 안내",
      lead: "의료법에 따른 비급여 진료비용 안내입니다. 아래에는 가격표를 읽는 방법과 고지 기준을 먼저 작성했습니다. 실제 항목별 금액과 제증명수수료는 의료기관에서 확인한 값을 반드시 등록해야 하며, 임의의 금액은 기재하지 않았습니다.",
      sections: [
        {
          heading: "1. 비급여 진료비용의 의미",
          body: "비급여 진료란 건강보험 또는 의료급여에서 급여 대상으로 정하지 않은 항목을 말합니다. 의료기관이 실제로 제공하고 비용을 징수하는 비급여 진료 항목과 가격은 이용자가 확인하기 쉽도록 공개되어야 합니다.",
        },
        {
          heading: "2. 비급여 진료비용 목록",
          body: "[확인 필요: 실제 비급여 진료비용 표]\n등록 권장 열: 구분 / 비급여 항목명 / 상세 명칭·범위 / 단위 / 금액(원) / 치료재료·약제비 포함 여부 / 특이사항 / 고지 기준일.\n눈성형·코성형·동안성형·쁘띠시술 등의 구분은 실제 병원 청구 항목에 맞추어 조정하며, 병원에서 징수하지 않는 항목은 게시하지 않습니다.",
        },
        {
          heading: "3. 제증명수수료 목록",
          body: "[확인 필요: 실제 제증명수수료 표]\n진단서·소견서·진료확인서·진료기록부 사본·영상 자료 발급 등 실제 제공하는 제증명 항목의 명칭, 발급 단위, 금액, 비고를 별도로 표시합니다. 발급 조건과 법령상 수수료 기준도 함께 점검합니다.",
        },
        {
          heading: "4. 비용 안내 및 변경",
          body: "게시된 비용은 표시된 항목·단위를 기준으로 하며, 환자의 상태·진료 내용·추가 검사 또는 처치 여부에 따라 구체적인 진료계획이 달라질 수 있습니다. 개별 비용은 진료 전 상담·설명 과정에서 확인해야 합니다. 가격 변경이 있는 경우 홈페이지의 고지 자료를 최신 상태로 수정합니다.",
        },
        {
          heading: "5. 고지 정보 및 문의",
          body: "가격표 고지 기준일: [확인 필요: 일자]\n진료비용 문의: [확인 필요: 병원 문의전화·이메일]\n※ 이 페이지에 실제 항목별 가격표가 등록되기 전에는 비급여 진료비용 고지 의무가 완료된 것으로 볼 수 없습니다.",
        },
      ],
    },
    "patient-rights": {
      title: "환자의 권리와 의무",
      lead: "환자는 충분히 설명받고 존중받으며 의료서비스를 이용할 권리가 있습니다. 의료기관과 환자 모두 안전하고 원활한 진료를 위해 서로의 권리와 책임을 존중합니다.",
      sections: [
        {
          heading: "1. 진료받을 권리",
          body: "환자는 성별, 나이, 사회적 지위 등과 관계없이 인간으로서 존엄과 가치를 존중받으며, 자신의 건강 보호와 증진을 위하여 적절한 의료서비스를 받을 권리가 있습니다.",
        },
        {
          heading: "2. 알 권리 및 자기결정권",
          body: "환자는 건강 상태, 진료 목적과 방법, 예상되는 효과 및 위험, 대안 등에 관해 이해할 수 있도록 설명받고 질문할 권리가 있습니다. 필요한 설명과 동의를 거쳐 진료 여부를 스스로 결정할 수 있습니다.",
        },
        {
          heading: "3. 비밀 보호받을 권리",
          body: "환자는 진료와 관련된 신체·건강정보 및 사생활을 보호받을 권리가 있습니다. 법령에서 허용하거나 정당한 근거가 있는 경우를 제외하고는 본인 의사에 반해 정보가 공개되어서는 안 됩니다.",
        },
        {
          heading: "4. 상담·조정·권리구제 요청",
          body: "환자는 진료나 의료서비스에 대한 의견·불편·불만을 제기하고 필요한 안내를 요청할 수 있습니다. 의료기관 내 문의 창구: [확인 필요: 실제 담당 부서·연락처]. 의료분쟁 등은 관계 법령에서 정한 기관이나 절차를 이용할 수 있습니다.",
        },
        {
          heading: "5. 진료정보 제공의 의무",
          body: "환자는 안전한 진료를 위해 과거 병력, 복용 약물, 알레르기, 임신 가능성 등 의료진이 질문하는 건강정보를 가능한 한 정확하게 알려야 합니다.",
        },
        {
          heading: "6. 의료진·다른 환자 존중의 의무",
          body: "환자는 의료진과 병원 종사자 및 다른 환자의 인격과 권리를 존중하고, 병원 내 안전·감염예방·시설 이용 관련 안내에 협조해야 합니다.",
        },
        {
          heading: "7. 진료 절차와 예약 준수",
          body: "환자는 정해진 진료 절차와 예약 시간을 준수하도록 협조하며, 방문이 어려운 경우 가능한 한 사전에 예약 변경·취소를 요청합니다.",
        },
      ],
    },
    "reservation-policy": {
      title: "온라인 방문 예약 및 취소 안내",
      lead: "홈페이지의 온라인 예약은 방문 상담을 위한 날짜와 시간의 예약입니다. 수술 일정·의학적 진단·특정 시술이나 결과를 확정하는 서비스가 아니며, 현재 기획상 온라인 예약금 결제는 제공하지 않습니다.",
      sections: [
        {
          heading: "제1조 예약 서비스의 성격",
          body: "온라인 예약은 병원 방문 상담을 위한 일정 관리 서비스입니다. 예약이 완료되더라도 특정 시술·수술의 진행, 진료 결과, 비용이나 수술 일자 등이 확정되는 것은 아닙니다.",
        },
        {
          heading: "제2조 예약 신청 및 확정",
          body: "로그인 후 예약 가능한 날짜와 시간대를 선택하고 필요한 정보를 입력합니다. 시스템에서 예약 완료로 표시된 경우 해당 방문 상담 시간이 예약된 것입니다. 예약 내역 및 상태는 마이페이지에서 확인할 수 있습니다.",
        },
        {
          heading: "제3조 예약 변경 및 취소",
          body: "예약 변경·취소는 마이페이지에서 제공되는 기능 또는 병원 문의처를 이용합니다. 변경 가능 여부는 선택한 일정과 병원 운영 사정에 따라 달라질 수 있습니다.\n[확인 필요: 취소 마감 시간·변경 횟수·당일 취소 정책]\n확정되지 않은 임의의 취소 수수료는 청구 정책에 포함하지 않습니다.",
        },
        {
          heading: "제4조 방문 준비 및 지각·미방문",
          body: "예약 시간에 방문해 주시고, 방문이 어려워지면 미리 연락해 주세요. 지각이나 미방문 시 실제 진료 운영 사정에 따라 일정 조정이 필요할 수 있습니다. [확인 필요: 병원 실제 안내 절차]",
        },
        {
          heading: "제5조 병원 사정으로 인한 변경",
          body: "의료진 일정, 응급 진료, 시설 점검 등 불가피한 사정으로 예약 일정이 변경될 경우 병원은 가능한 연락 수단을 통해 안내하고 대체 일정 등을 협의합니다. [확인 필요: 연락 방법 및 담당 창구]",
        },
        {
          heading: "제6조 비용 및 결제",
          body: "현재 홈페이지에서는 예약금·시술비를 온라인으로 선결제하지 않습니다. 상담·검사·시술·수술에 관한 비용과 결제 방법은 실제 진료·상담 과정에서 별도 안내합니다. 향후 온라인 결제 기능을 도입한다면 별도의 결제·취소·환불 규정을 마련하고 고지해야 합니다.",
        },
        {
          heading: "제7조 개인정보 처리",
          body: "예약에 필요한 연락처, 일정 및 상담 관련 정보는 개인정보처리방침에 따라 처리합니다. 질환, 복용 약물, 수술 이력 등 민감정보를 수집하는 경우에는 관련 법령상 적법한 처리 근거와 별도 안내·동의 절차를 마련합니다.",
        },
        {
          heading: "제8조 문의 및 시행",
          body: "예약 관련 문의: [확인 필요: 문의전화·이메일·운영시간]\n정책 시행일: [확인 필요: 시행일]. 변경 시 홈페이지에 주요 내용을 고지합니다.",
        },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      lead: "AHN’S Plastic Surgery (the “Clinic”) respects personal information and provides this notice under applicable Korean privacy law. This is a practical template; fields marked [VERIFY] must match actual operations before publication.",
      sections: [
        {
          heading: "1. Controller and scope",
          body: "This policy covers personal data processed through the website, accounts, consultation enquiries, bookings and customer support. Legal name of the healthcare provider and operating entity: [VERIFY: registered name]. Clinical records may be governed by additional healthcare rules and notices.",
        },
        {
          heading: "2. Purposes and legal grounds",
          body: "Account creation, authentication and abuse prevention; appointment booking, changes and notifications; responding to consultation requests; website security and incident response. Promotional messages are sent only with an applicable lawful basis, such as valid consent. [VERIFY: the legal basis for each purpose and service].",
        },
        {
          heading: "3. Categories of information",
          body: "Potential registration fields: name, username, hashed password, email, mobile number and any other fields actually collected. Booking fields: user identifier, time slot and consultation category. Enquiries may contain contact details and message content. Technical data may include access timestamps, IP addresses and cookies. [VERIFY: required/optional fields, database fields and logs]. Do not collect national resident registration numbers at ordinary online signup without a specific lawful exception.",
        },
        {
          heading: "4. Sensitive data and minors",
          body: "Health details, medication, surgical history and patient photographs may constitute sensitive information. They must only be processed on a valid legal ground with any required separate consent. If the service processes the data of children under 14 where guardian consent is required, an appropriate consent and verification process must be used. [VERIFY: age policy].",
        },
        {
          heading: "5. Retention periods",
          body: "Retain information only as long as necessary for the relevant purpose, unless a law requires otherwise. Account information is generally kept while the account is maintained; appointment and consultation data follow actual retention policies; legally mandated medical records follow their statutory periods. [VERIFY: periods and legal grounds for each type; deletion and account closure rules].",
        },
        {
          heading: "6. Disclosure to third parties",
          body: "Personal data is not disclosed to outside parties without a lawful ground, such as valid consent or a legal requirement. Where applicable, disclose recipients, purposes, information categories, retention periods and consequences of refusal. [VERIFY: actual recipients or confirm none].",
        },
        {
          heading: "7. Service providers / processors",
          body: "If hosting, SMS, email, reservation administration or other operations are outsourced, the Clinic identifies its processors and processing tasks and manages them as required by law. [VERIFY: processor names, outsourced activities and onward outsourcing].",
        },
        {
          heading: "8. International transfers",
          body: "For any overseas transfer, disclose the required legal basis, destination, recipient, timing and method, types of data, purpose, retention and any applicable refusal rights. [VERIFY: whether overseas hosting, analytics or communications tools are used].",
        },
        {
          heading: "9. Deletion",
          body: "Data that is no longer needed is deleted without undue delay unless legal retention applies. Electronic records are erased securely and paper documents are shredded or destroyed appropriately. Information retained by law is kept separately.",
        },
        {
          heading: "10. Safeguards",
          body: "Appropriate measures include access controls, protection of credentials, encryption where required, audit logging, system updates, employee training and physical security. [VERIFY: actual security controls].",
        },
        {
          heading: "11. Your rights",
          body: "Individuals may request access, correction, deletion, suspension of processing and withdrawal of consent as permitted by law. Requests may be made through [VERIFY: contact channel]. Identity or representation may need to be checked. Statutory medical record retention may limit some requests.",
        },
        {
          heading: "12. Cookies and analytics",
          body: "The site may use cookies for login status and language preferences. Browser settings can delete or block cookies, but some functions may not work. [VERIFY: actual cookies, analytics/advertising technologies, retention and opt-out options].",
        },
        {
          heading: "13. Further uses and automated decisions",
          body: "Any further use or sharing must meet applicable legal criteria. If automated decision-making or behavioral profiling subject to statutory obligations is used, provide the required disclosures and rights information. [VERIFY: whether applicable].",
        },
        {
          heading: "14. Privacy contact and remedies",
          body: "Privacy officer: [VERIFY: name/title]. Team: [VERIFY]. Email: [VERIFY]. Telephone: [VERIFY]. Privacy-related issues may also be raised through the Korean privacy infringement reporting service at 118.",
        },
        {
          heading: "15. Effective date and amendments",
          body: "Effective date: [VERIFY: date]. Material updates will be posted with the effective date, and additional notice will be given where required. Prior versions: [VERIFY: archive location].",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      lead: "These terms describe the general rules for website accounts, consultation enquiries and appointment bookings. Details must be checked against actual clinic policy before they take effect.",
      sections: [
        {
          heading: "1. Purpose and operator",
          body: "These terms govern use of the online services operated by AHN’S Plastic Surgery. Registered legal name and contact details: [VERIFY].",
        },
        {
          heading: "2. Definitions",
          body: "“Services” include the website, accounts, enquiries, visit bookings and booking history. “Member” is a registered user. A “booking” reserves a consultation visit and is not a medical-treatment or surgery agreement.",
        },
        {
          heading: "3. Availability and changes of terms",
          body: "The terms will be accessible on the website. Amendments may be made in compliance with law and communicated, including an effective date and any individual notice required for material changes.",
        },
        {
          heading: "4. Services and interruptions",
          body: "Services may include information about the clinic, online accounts, booking requests and announcements. Availability may be interrupted for maintenance, outages or security, with reasonable notice when possible.",
        },
        {
          heading: "5. Registration and account security",
          body: "Members must submit accurate details and safeguard account credentials. Registration or use may be restricted for legitimate security or misuse concerns, subject to applicable law.",
        },
        {
          heading: "6. Minors and consent",
          body: "Required parental or guardian consent and verification is obtained where applicable. Website registration does not replace medical informed consent.",
        },
        {
          heading: "7. Account changes and withdrawal",
          body: "Users may request correction of account details or account closure through available channels. Personal information is handled under the Privacy Policy and any legal retention requirements.",
        },
        {
          heading: "8. Appointment bookings",
          body: "Online bookings concern consultation visits only. Final treatment eligibility, surgery plans, fees and outcomes are determined through clinical consultation. See the separate Booking & Cancellation Guide.",
        },
        {
          heading: "9. Medical information",
          body: "Website content is general information, not individual diagnosis or medical advice. Discuss benefits, risks, alternatives and pricing with qualified medical professionals. For emergencies, seek urgent medical assistance rather than relying on website enquiries.",
        },
        {
          heading: "10. User responsibilities",
          body: "Do not impersonate others, submit false bookings, infringe privacy or intellectual property, transmit malicious software, or interfere with website operations.",
        },
        {
          heading: "11. Suspension and restriction",
          body: "Access may be limited for lawful and proportionate reasons such as fraud, security threats or repeated interference, with notice and a way to contest it when appropriate.",
        },
        {
          heading: "12. Content and intellectual property",
          body: "Website text, designs and images remain the property of their rightful owners. Uploads must not violate others’ rights; patient images and testimonials require appropriate consent and medical-advertising compliance.",
        },
        {
          heading: "13. Privacy and marketing",
          body: "Personal data is processed under the Privacy Policy. Promotional communications require an applicable legal basis and an accessible opt-out method.",
        },
        {
          heading: "14. Complaints and disputes",
          body: "Legal responsibilities are not excluded by these terms. Contact [VERIFY: clinic support] with complaints. Disputes are handled through applicable law and appropriate processes.",
        },
        {
          heading: "Effective date",
          body: "[VERIFY: effective date and previous-version archive].",
        },
      ],
    },
    "non-covered-fees": {
      title: "Non-Covered Medical Fees and Certificate Charges",
      lead: "The Clinic must display actual non-covered charges and certificate fees. The following describes how fees will be disclosed; no unverified prices have been inserted.",
      sections: [
        {
          heading: "1. Meaning of non-covered fees",
          body: "Non-covered medical services are items outside applicable public health insurance benefit coverage. Fees for items actually charged by the Clinic should be clearly listed.",
        },
        {
          heading: "2. Treatment price schedule",
          body: "[VERIFY: approved fee schedule]. Recommended columns: category, item/service, details, unit, amount in KRW, included/excluded materials or drugs, notes and update date. Include only services actually offered and charged.",
        },
        {
          heading: "3. Certificate fees",
          body: "[VERIFY: actual certificate/document charges]. List fees and units for certificates, medical-record copies and other documents provided by the Clinic, subject to applicable fee requirements.",
        },
        {
          heading: "4. Changes and consultation",
          body: "Treatment plans and additional services may vary by patient. Discuss the applicable total charges before treatment; update posted fees when prices change.",
        },
        {
          heading: "5. Contact and effective date",
          body: "Posted fee schedule date: [VERIFY]. Fee enquiries: [VERIFY]. This page is not a completed statutory fee notice until actual itemized prices are added.",
        },
      ],
    },
    "patient-rights": {
      title: "Patient Rights and Responsibilities",
      lead: "Patients and clinic staff should treat each other with dignity, share information and support safe care.",
      sections: [
        {
          heading: "1. Right to care",
          body: "Patients have the right to appropriate medical care with respect and dignity.",
        },
        {
          heading: "2. Information and self-determination",
          body: "Patients may ask questions and receive understandable explanations of the diagnosis, procedure, expected benefits, risks and alternatives, then make informed decisions.",
        },
        {
          heading: "3. Privacy",
          body: "Patients have the right to confidentiality of medical and personal information, subject to lawful exceptions.",
        },
        {
          heading: "4. Concerns and remedies",
          body: "Patients can raise complaints and seek information about applicable resolution procedures. Contact: [VERIFY: patient support team].",
        },
        {
          heading: "5. Accurate health information",
          body: "Patients should provide medical professionals with relevant and accurate information about history, allergies, medication and health conditions.",
        },
        {
          heading: "6. Mutual respect",
          body: "Respect medical personnel, other patients, facility safety requirements and infection-prevention measures.",
        },
        {
          heading: "7. Appointments",
          body: "Attend at scheduled times and provide advance notice if a visit must be changed or cancelled.",
        },
      ],
    },
    "reservation-policy": {
      title: "Booking & Cancellation Guide",
      lead: "A website booking is for a consultation visit only. It does not confirm surgery, a treatment plan, an outcome or online payment of a deposit.",
      sections: [
        {
          heading: "1. Nature of booking",
          body: "The appointment provides a consultation time slot. Medical suitability, procedures, prices and surgery dates are determined later.",
        },
        {
          heading: "2. How to book",
          body: "Sign in, choose an available date/time and provide necessary information. When the system shows a confirmed booking, the consultation visit is booked. View its status in My Page.",
        },
        {
          heading: "3. Changes and cancellations",
          body: "Change or cancel through My Page where available or contact the clinic. [VERIFY: cut-off times, same-day policy and change limits]. No unapproved cancellation charges are assumed.",
        },
        {
          heading: "4. Late or missed visits",
          body: "Please contact the Clinic if you cannot arrive on time. Rescheduling may be needed based on clinic capacity. [VERIFY: actual procedure].",
        },
        {
          heading: "5. Clinic schedule changes",
          body: "If staffing, emergencies or maintenance affect appointments, the Clinic will use available contact methods to notify patients and discuss alternatives. [VERIFY: contact procedure].",
        },
        {
          heading: "6. Payment",
          body: "No online reservation deposit or procedure payment is included in the current website plan. Any treatment costs and payment method are discussed separately at the Clinic. Adding online payments will require new payment/refund rules.",
        },
        {
          heading: "7. Personal data",
          body: "Booking information is processed under the Privacy Policy. Sensitive health information requires a valid legal basis and any separately required notice or consent.",
        },
        {
          heading: "8. Enquiries / effective date",
          body: "Booking contact: [VERIFY]. Effective date: [VERIFY].",
        },
      ],
    },
  },
  ja: {
    privacy: {
      title: "個人情報処理方針",
      lead: "AHN’S美容外科（以下「当院」）は韓国の個人情報保護法などの関係法令に基づき個人情報を適切に取り扱います。本書は一般条項を記載した草案です。［要確認］の項目を実際の運用情報に置き換えてください。",
      sections: [
        {
          heading: "第1条 取扱事業者と適用範囲",
          body: "本方針は当院のウェブサイト、会員登録、来院予約、オンライン相談、お問い合わせに適用されます。医療機関の正式名称・運営者：［要確認：登録上の名称］。診療記録には医療関係法令による別の取扱いが適用される場合があります。",
        },
        {
          heading: "第2条 利用目的と法的根拠",
          body: "会員認証・アカウント管理・不正利用防止、予約の登録・変更・連絡、相談への回答、システムの安全管理のために必要な範囲で個人情報を処理します。広告・イベント情報は適法な根拠（必要な同意など）がある場合に限ります。［要確認：目的ごとの法的根拠］。",
        },
        {
          heading: "第3条 取り扱う個人情報",
          body: "会員登録時：氏名、ユーザーID、暗号化済みパスワード、メール、電話番号など。予約時：会員情報、日時、相談分野など。相談時：連絡先、問い合わせ本文など。利用時：IPアドレス、アクセス日時、Cookieなど。［要確認：必須・任意の入力項目、ログ項目］。一般的なオンライン会員登録で法的根拠なく住民登録番号を取得してはなりません。",
        },
        {
          heading: "第4条 要配慮情報と未成年者",
          body: "健康状態、服薬、施術歴、患者写真などは機微な個人情報に該当する場合があります。適法な根拠および必要な個別同意がある場合のみ処理します。14歳未満の児童について保護者の同意が必要な場合は、適切な確認手続きを行います。［要確認：登録年齢に関する方針］。",
        },
        {
          heading: "第5条 保存・利用期間",
          body: "原則として目的達成まで保持し、法令に基づく保存義務がある場合はその期間保管します。会員情報、予約・相談情報、診療記録、アクセス記録について［要確認：それぞれの具体的期間・法的根拠］。退会後も法定保存が必要な情報は分離管理します。",
        },
        {
          heading: "第6条 第三者への提供",
          body: "法令で認められる場合や適法な同意がある場合などを除き、個人情報を第三者へ提供しません。提供する場合は提供先、目的、項目、保有期間などを案内します。［要確認：提供先の有無・一覧］。",
        },
        {
          heading: "第7条 取扱業務の委託",
          body: "ホスティング、メール・SMS配信、予約システムなどを外部に委託する場合、受託者・業務内容を公開し、法令に従って管理・監督します。［要確認：委託先、業務、再委託の有無］。",
        },
        {
          heading: "第8条 国外移転",
          body: "国外クラウド・分析ツール等への移転がある場合、法的根拠、移転先の国・事業者、項目、時期・方法、目的、保存期間、拒否に関する案内を行います。［要確認：国外移転の有無と詳細］。",
        },
        {
          heading: "第9条 破棄方法",
          body: "利用目的を達成し保存の必要がなくなった情報は速やかに削除します。法定保存が必要な情報は分離管理します。電子情報は復元が困難な方法で消去し、紙媒体は裁断等により処分します。",
        },
        {
          heading: "第10条 安全管理措置",
          body: "アクセス権限の管理、認証情報の保護、必要な暗号化、ログ管理、システム更新、従業員教育、物理的管理など、リスクに応じた対策を実施します。［要確認：実際の措置］。",
        },
        {
          heading: "第11条 本人の権利",
          body: "適用法令に基づき、開示・訂正・削除・処理停止・同意撤回などを求めることができます。窓口：［要確認：連絡先・方法］。本人確認が必要な場合があります。診療記録等は法定保存義務により制限されることがあります。",
        },
        {
          heading: "第12条 Cookieと分析",
          body: "ログイン状態や選択言語を記憶するためCookieを使用する場合があります。ブラウザで削除・拒否できますが一部機能が制限されることがあります。［要確認：実際のCookie、分析・広告ツール、保存期間］。",
        },
        {
          heading: "第13条 追加利用・自動化された判断",
          body: "収集目的と合理的に関連する追加利用や提供には法令上の要件を満たす必要があります。法令上の説明義務がある自動化された判断等を利用する場合には必要な情報を案内します。［要確認：利用の有無］。",
        },
        {
          heading: "第14条 個人情報保護責任者・問い合わせ",
          body: "責任者：［要確認：氏名・役職］。担当部署：［要確認］。メール：［要確認］。電話：［要確認］。韓国の個人情報侵害相談は118番でも受け付けています。",
        },
        {
          heading: "第15条 施行日と改定",
          body: "施行日：［要確認：日付］。変更した場合は内容と施行日をサイトで案内し、必要に応じて個別通知します。旧版の閲覧：［要確認：掲載先］。",
        },
      ],
    },
    terms: {
      title: "サービス利用規約",
      lead: "本規約は当院ウェブサイトの会員サービス・オンライン相談・来院予約に関する一般条項です。実際の運用と照合のうえ適用してください。",
      sections: [
        {
          heading: "第1条 目的・運営者",
          body: "AHN’S美容外科のオンラインサービスの利用条件を定めます。運営者の正式名称と連絡先：［要確認］。",
        },
        {
          heading: "第2条 定義",
          body: "「サービス」とはサイト、会員アカウント、問い合わせ、来院予約などを指します。「会員」は登録済み利用者を指します。「予約」は来院相談の時間確保であり、施術・手術契約ではありません。",
        },
        {
          heading: "第3条 規約の掲示・変更",
          body: "規約をサイトで確認できるよう掲示します。法令に従い改定する際は内容、施行日などを告知し、必要な場合は個別通知します。",
        },
        {
          heading: "第4条 提供サービス・中断",
          body: "病院情報、アカウント管理、相談・予約、告知等を提供します。保守・障害・安全上の理由で一時的に停止する場合は可能な範囲で案内します。",
        },
        {
          heading: "第5条 登録・アカウント",
          body: "正確な登録情報を提供し、IDとパスワードを適切に管理してください。不正利用や安全上の問題がある場合、法令の範囲で利用を制限することがあります。",
        },
        {
          heading: "第6条 未成年者",
          body: "年齢に応じて保護者の同意など必要な手続きを行います。会員登録の同意は医療行為に必要な説明・同意の代わりにはなりません。",
        },
        {
          heading: "第7条 情報変更・退会",
          body: "利用者は登録情報の変更や退会を申請できます。退会後の情報は個人情報処理方針と法定保存義務に従って処理します。",
        },
        {
          heading: "第8条 予約・相談",
          body: "オンライン予約は来院相談の時間予約です。施術可能性、料金、手術日程等は実際の診察で決定します。変更・キャンセルは別途案内に従います。",
        },
        {
          heading: "第9条 医療情報",
          body: "掲載情報は一般的な参考情報であり個別診断ではありません。効果・リスク・代替手段等は医師に相談してください。緊急時はウェブ相談ではなく緊急医療を利用してください。",
        },
        {
          heading: "第10条 利用者の義務",
          body: "他人へのなりすまし、虚偽予約、個人情報・知的財産権の侵害、不正アクセス、サービス妨害等を禁止します。",
        },
        {
          heading: "第11条 利用制限",
          body: "不正行為やセキュリティ上の重大な問題等がある場合、相当な範囲で利用を制限し、必要な場合は理由と異議申し立て方法を案内します。",
        },
        {
          heading: "第12条 投稿・知的財産",
          body: "サイトの文章・画像等は正当な権利者に帰属します。写真・口コミの投稿時は第三者の権利を守り、患者写真の公開には適法な同意等が必要です。",
        },
        {
          heading: "第13条 個人情報・広告",
          body: "個人情報は個人情報処理方針に従って取り扱います。広告配信には適法な根拠を備え、受信拒否方法を案内します。",
        },
        {
          heading: "第14条 問い合わせ・紛争",
          body: "当院の法律上の責任を不当に免除するものではありません。問い合わせ先：［要確認］。紛争は適用法令と適切な手続きに従い解決します。",
        },
        {
          heading: "施行日",
          body: "［要確認：施行日・旧版の保存先］。",
        },
      ],
    },
    "non-covered-fees": {
      title: "自由診療料金・証明書発行手数料",
      lead: "当院が実際に請求する自由診療項目と料金、証明書発行費用を公開するページです。確認できない料金は記載していません。",
      sections: [
        {
          heading: "1. 自由診療料金",
          body: "公的医療保障の給付対象外となる診療について、実際の項目と料金を利用者が分かるように掲載する必要があります。",
        },
        {
          heading: "2. 料金表",
          body: "［要確認：正式な項目別料金表］。区分、項目名、内容、単位、金額（KRW）、薬剤・材料費の扱い、備考、基準日を掲載します。実際に請求する項目のみ登録してください。",
        },
        {
          heading: "3. 証明書発行手数料",
          body: "［要確認：実際の証明書・診療記録コピー等の手数料］。項目、発行単位、金額、備考を掲載してください。",
        },
        {
          heading: "4. 料金の変更・説明",
          body: "患者の状態や追加処置により治療計画は異なる場合があります。診療前の説明で費用を確認し、料金変更時は公開情報を更新します。",
        },
        {
          heading: "5. 問い合わせ",
          body: "料金表の基準日：［要確認］。問い合わせ先：［要確認］。項目別の正式金額が未掲載の場合、法定の料金公示が完了したことにはなりません。",
        },
      ],
    },
    "patient-rights": {
      title: "患者の権利と義務",
      lead: "患者と医療スタッフは互いの尊厳を守り、安全な診療に協力します。",
      sections: [
        {
          heading: "1. 診療を受ける権利",
          body: "患者は尊厳を尊重され、適切な医療を受ける権利があります。",
        },
        {
          heading: "2. 説明と自己決定",
          body: "診断、治療方法、予想される効果とリスク、代替方法などについて説明を受け、理解したうえで決定する権利があります。",
        },
        {
          heading: "3. プライバシー",
          body: "診療に関する個人情報やプライバシーは、法令で認められる場合等を除いて保護されます。",
        },
        {
          heading: "4. 相談・救済",
          body: "不安や苦情を申し出て、利用可能な相談・調整手続きの案内を受けられます。［要確認：相談窓口］。",
        },
        {
          heading: "5. 正確な健康情報の提供",
          body: "病歴、薬、アレルギー、健康状態など、診療に必要な情報を可能な限り正確に伝えてください。",
        },
        {
          heading: "6. 相互の尊重",
          body: "医療スタッフ、他の患者、院内の安全・感染予防ルールを尊重してください。",
        },
        {
          heading: "7. 予約の遵守",
          body: "予約時間を守り、変更・キャンセルが必要な場合は事前に連絡してください。",
        },
      ],
    },
    "reservation-policy": {
      title: "オンライン予約・キャンセルのご案内",
      lead: "オンライン予約は来院相談の日時を確保するもので、手術や治療結果を保証しません。現在、オンライン予約金決済は計画していません。",
      sections: [
        {
          heading: "第1条 予約の性質",
          body: "予約は来院相談の時間確保です。実際の治療の可否、料金、手術日程は診察・相談後に決定されます。",
        },
        {
          heading: "第2条 予約方法",
          body: "ログインして空き日時と必要情報を入力します。予約完了と表示された場合、その相談時間が予約されます。マイページで状態を確認できます。",
        },
        {
          heading: "第3条 変更・キャンセル",
          body: "マイページの機能または病院の窓口から申し出てください。［要確認：キャンセル締切・当日変更・変更回数］。未承認のキャンセル料は定めていません。",
        },
        {
          heading: "第4条 遅刻・無断欠席",
          body: "遅れる場合や来院できない場合は事前にご連絡ください。状況により日程調整が必要になることがあります。［要確認：運用手順］。",
        },
        {
          heading: "第5条 病院都合の変更",
          body: "緊急対応、医師の予定、設備点検等により変更が必要な場合、利用可能な連絡手段で案内し代替日程を相談します。［要確認：連絡手段］。",
        },
        {
          heading: "第6条 料金・支払い",
          body: "現行のサイトではオンライン予約金・治療費の前払いは行いません。治療費と支払い方法は個別相談で案内します。将来決済機能を追加する際は別途規約を整備します。",
        },
        {
          heading: "第7条 個人情報",
          body: "予約情報は個人情報処理方針に従って取り扱います。健康等の機微情報には法的根拠と必要な個別同意等を備えます。",
        },
        {
          heading: "第8条 問い合わせ・施行日",
          body: "問い合わせ先：［要確認］。施行日：［要確認］。",
        },
      ],
    },
  },
  "zh-CN": {
    privacy: {
      title: "隐私政策",
      lead: "AHN’S整形外科（以下简称“本院”）依据韩国个人信息保护相关法律处理个人信息。本页为常用条款草案，标注【待核实】的内容必须与本院实际运营情况一致后方可正式发布。",
      sections: [
        {
          heading: "第一条 处理者及适用范围",
          body: "适用于本院网站、会员注册、在线咨询、到院预约及客服服务。医疗机构登记名称及运营主体：【待核实】。诊疗记录可能另受医疗法规和相关告知规定管理。",
        },
        {
          heading: "第二条 处理目的与法律依据",
          body: "用于会员身份验证及账户管理、防止不当使用、预约登记与调整、答复咨询、网站安全管理等。广告及活动通知仅在具有合法依据（如有效同意）时发送。【待核实：各项目的法律依据】。",
        },
        {
          heading: "第三条 个人信息类别",
          body: "注册时可能涉及姓名、账号、经加密的密码、邮箱、手机号；预约时涉及身份标识、日期时间、咨询类别；咨询时涉及联系信息及留言；使用时可能产生IP地址、访问时间、Cookie等。【待核实：实际必填/选填字段、数据库字段、日志】。普通线上会员注册不得在无明确法定依据时收集韩国居民登记号码。",
        },
        {
          heading: "第四条 敏感信息及未成年人",
          body: "健康状况、服药信息、既往手术、患者照片等可能属于敏感个人信息。仅在法律允许且已取得所需单独同意等合法依据时处理。涉及未满14周岁儿童且依法需要监护人同意时，应完成同意与监护人确认。【待核实：年龄政策】。",
        },
        {
          heading: "第五条 保存及使用期限",
          body: "通常在处理目的实现之前保存信息；法律规定必须保留的，按相应期限另行保存。会员、预约、咨询、诊疗记录、访问日志等具体期限及依据：【待核实：逐项期限】。注销后依法必须保存的信息将分别管理。",
        },
        {
          heading: "第六条 向第三方提供",
          body: "除依法允许或取得有效同意等具有合法依据的情况外，不向第三方提供个人信息。如确需提供，将说明接收方、目的、项目、保存期限等。【待核实：实际接收方或确认无提供】。",
        },
        {
          heading: "第七条 委托处理",
          body: "如委托网站托管、短信、电子邮件、预约管理等处理个人信息，将依法公开受托方与委托业务并进行监督。【待核实：受托方名称、业务、再委托情况】。",
        },
        {
          heading: "第八条 跨境传输",
          body: "如使用境外云服务、分析工具或通信服务并发生跨境传输，将依法说明法律依据、国家、接收方、项目、时间与方式、目的、保存期及相关拒绝权利。【待核实：是否存在跨境传输】。",
        },
        {
          heading: "第九条 删除及销毁",
          body: "个人信息在不再需要时及时销毁，法定须保留的信息另行保存。电子信息以难以恢复的方式删除，纸质文件通过粉碎等方式处理。",
        },
        {
          heading: "第十条 安全保护措施",
          body: "根据风险采取权限控制、凭证保护、必要的加密、日志管理、安全更新、员工培训及物理保护等措施。【待核实：实际安全措施】。",
        },
        {
          heading: "第十一条 个人权利",
          body: "用户可在适用法律范围内申请查阅、更正、删除、停止处理或撤回同意。联系方式：【待核实】。本院可核验申请人身份；依法需要保留的医疗记录可能受到删除限制。",
        },
        {
          heading: "第十二条 Cookie及分析",
          body: "网站可能以Cookie保持登录状态或保存所选语言。用户可通过浏览器删除或拒绝Cookie，但部分功能可能受限。【待核实：实际Cookie、分析及广告工具、保存期限】。",
        },
        {
          heading: "第十三条 其他使用及自动化决策",
          body: "相关目的以外的进一步处理或提供须符合法律要求。若使用需要依法告知的自动化决策、行为画像等功能，将另行披露相应信息与权利。【待核实：是否使用】。",
        },
        {
          heading: "第十四条 负责人及投诉渠道",
          body: "个人信息保护负责人：【待核实：姓名及职位】；部门：【待核实】；邮箱：【待核实】；电话：【待核实】。在韩国可拨打118咨询个人信息侵害问题。",
        },
        {
          heading: "第十五条 生效及修改",
          body: "生效日期：【待核实】。修订时将公布修改内容及日期；依法需单独通知的将另行通知。历史版本位置：【待核实】。",
        },
      ],
    },
    terms: {
      title: "服务使用条款",
      lead: "本条款为网站账户、在线咨询与到院预约的通用规则草案。正式实施前应与本院真实运营规定核对。",
      sections: [
        {
          heading: "第一条 目的和运营者",
          body: "规定AHN’S整形外科线上服务的使用条件。注册名称和联系方式：【待核实】。",
        },
        {
          heading: "第二条 定义",
          body: "“服务”包括网站、会员账户、咨询、预约及记录查询；“会员”为已注册用户；“预约”仅指到院咨询时段，不代表手术或诊疗合同。",
        },
        {
          heading: "第三条 条款公示与修改",
          body: "本院在网站提供条款供用户阅读。依法变更时公布变更内容与生效日期，并在必要时单独通知。",
        },
        {
          heading: "第四条 服务内容与中断",
          body: "提供院所介绍、账户管理、咨询与预约等功能。因维护、故障或安全问题可能暂时中断，能够提前通知时将尽量说明。",
        },
        {
          heading: "第五条 注册和账户安全",
          body: "用户应提交真实信息并妥善保护账号与密码。对欺诈、恶意使用等合法理由，可依法限制注册或使用。",
        },
        {
          heading: "第六条 未成年人",
          body: "依法需要监护人同意时履行相应手续。注册同意不能替代医疗操作所需的知情同意。",
        },
        {
          heading: "第七条 资料变更与注销",
          body: "用户可通过提供的渠道更正资料或申请注销。注销后的数据依隐私政策及法定保存义务处理。",
        },
        {
          heading: "第八条 预约与咨询",
          body: "在线预约仅为到院咨询。手术适应性、具体方案、价格和日期应通过医疗咨询决定，修改及取消规则见单独说明。",
        },
        {
          heading: "第九条 医疗信息",
          body: "网站内容是一般信息，不构成针对个人的诊断。应向医生了解效果、风险及替代方法；发生紧急情况时应寻求紧急医疗服务。",
        },
        {
          heading: "第十条 用户义务",
          body: "不得冒用身份、提交虚假预约、侵害隐私或知识产权、传输恶意程序或妨碍网站运行。",
        },
        {
          heading: "第十一条 使用限制",
          body: "对欺诈、危害安全或反复干扰等情况，可采取必要且适当的限制措施，并在适当时告知原因及申诉渠道。",
        },
        {
          heading: "第十二条 内容与知识产权",
          body: "网站内容归合法权利人所有；上传的评价和照片不得侵害他人权利，患者照片公开须遵守同意与医疗广告规定。",
        },
        {
          heading: "第十三条 隐私和营销",
          body: "个人信息依隐私政策处理，营销消息须有合法依据，并提供退出方式。",
        },
        {
          heading: "第十四条 投诉及纠纷",
          body: "本条款不排除本院依法承担的责任。投诉渠道：【待核实】。争议依适用法律和适当程序解决。",
        },
        {
          heading: "生效日期",
          body: "【待核实：生效日期、历史版本】。",
        },
      ],
    },
    "non-covered-fees": {
      title: "非医保诊疗费用及证明文件收费",
      lead: "本页用于公布本院实际收取的非医保费用及证明文件费用。未核实的金额不会随意填写。",
      sections: [
        {
          heading: "一、非医保费用",
          body: "对不属于相关公共医保给付范围、由本院实际收费的项目，应公布项目名称及价格。",
        },
        {
          heading: "二、诊疗费用表",
          body: "【待核实：正式收费表】。建议包括类别、项目、说明、计价单位、韩元金额、药品/材料是否包含、备注与更新时间。仅列真实收费项目。",
        },
        {
          heading: "三、证明文件收费",
          body: "【待核实：诊断证明、病历复印等实际收费表】。列明项目、单位、金额与备注。",
        },
        {
          heading: "四、价格变化与咨询",
          body: "患者情况及额外检查等可能影响诊疗方案。应在诊疗前说明费用并及时更新公开价格。",
        },
        {
          heading: "五、联系方式",
          body: "收费标准日期：【待核实】；咨询电话：【待核实】。未公布实际逐项价格前，不能视为已完成法定收费公示。",
        },
      ],
    },
    "patient-rights": {
      title: "患者权利与义务",
      lead: "患者和医务人员应相互尊重，共同维护安全、透明的医疗环境。",
      sections: [
        {
          heading: "一、获得医疗服务的权利",
          body: "患者有权受到尊重并获得适当的医疗服务。",
        },
        {
          heading: "二、知情与自主选择",
          body: "患者有权了解诊断、治疗方式、预期效果、风险及替代方案，并在理解后决定是否接受。",
        },
        {
          heading: "三、隐私保护",
          body: "与诊疗有关的个人信息和私人生活应得到保护，法律允许的例外情况除外。",
        },
        {
          heading: "四、投诉与救济",
          body: "患者可以提出建议、投诉及咨询适用的处理程序。【待核实：投诉渠道】。",
        },
        {
          heading: "五、准确提供健康信息",
          body: "应尽量如实提供病史、过敏、服药及其他诊疗所需信息。",
        },
        {
          heading: "六、尊重他人",
          body: "尊重医护人员、其他患者及院内安全和感染预防规定。",
        },
        {
          heading: "七、遵守预约",
          body: "尽量按时到院，需要变更时提前联系。",
        },
      ],
    },
    "reservation-policy": {
      title: "在线预约与取消说明",
      lead: "在线预约仅用于安排到院咨询，不代表手术已确认或保证治疗效果。目前网站不收取线上预约定金。",
      sections: [
        {
          heading: "第一条 预约性质",
          body: "预约仅确定到院咨询时段，实际诊疗方式、费用和手术日期经咨询后确定。",
        },
        {
          heading: "第二条 预约方式",
          body: "登录后选择可预约时间并提交必要资料；系统显示已确认时视为咨询时间预订成功，可在个人中心查看。",
        },
        {
          heading: "第三条 修改和取消",
          body: "可通过个人中心相关功能或联系本院处理。【待核实：取消截止时间、当日规则及修改次数】。未批准的取消手续费不在当前政策中。",
        },
        {
          heading: "第四条 迟到或未到院",
          body: "无法准时到院时请提前告知。视医院安排可能需要调整时间。【待核实：具体办法】。",
        },
        {
          heading: "第五条 本院安排变更",
          body: "如遇紧急医疗安排、人员或设施调整，本院将通过可用联系方式通知并协商其他时段。【待核实：联系方式】。",
        },
        {
          heading: "第六条 费用与支付",
          body: "现阶段不提供线上预约定金或治疗费预付。具体费用与支付方式由面诊另行说明；日后增加支付功能时应制定相应退款规则。",
        },
        {
          heading: "第七条 个人信息",
          body: "预约信息依隐私政策处理；健康敏感信息须有合法依据及必要的单独告知和同意。",
        },
        {
          heading: "第八条 联系及生效",
          body: "预约咨询：【待核实】；生效日期：【待核实】。",
        },
      ],
    },
  },
  "zh-TW": {
    privacy: {
      title: "隱私權政策",
      lead: "AHN’S整形外科（以下稱「本院」）依韓國個人資料保護相關法令處理個人資料。本頁為通用條款草案，【待確認】的內容須核實實際營運情況後才能正式發布。",
      sections: [
        {
          heading: "第一條 處理者及適用範圍",
          body: "適用於本院網站、會員註冊、線上諮詢、到院預約及客服服務。醫療機構登記名稱與營運主體：【待確認】。診療紀錄可能另受醫療相關法令與告知規定約束。",
        },
        {
          heading: "第二條 處理目的與法律依據",
          body: "用於會員驗證、帳戶管理、防止不當使用、預約登記及調整、回覆諮詢、網站安全管理等。廣告與活動通知僅在具有合法依據（如有效同意）時發送。【待確認：各項目的法律依據】。",
        },
        {
          heading: "第三條 個人資料類別",
          body: "註冊時可能涉及姓名、帳號、加密密碼、電子郵件、手機號碼；預約涉及身分識別、日期時間及諮詢類別；諮詢涉及聯絡資訊與留言；使用網站時可能產生IP位址、存取時間及Cookie等。【待確認：實際必填/選填欄位、資料庫、紀錄】。一般線上註冊不得在無明確法律依據時蒐集韓國居民登錄號碼。",
        },
        {
          heading: "第四條 敏感資訊與未成年人",
          body: "健康狀態、用藥、過往手術及病患照片等可能屬敏感個人資料。僅於法律允許並取得必要個別同意等合法依據時處理。涉及未滿14歲兒童且依法需法定代理人同意時，應完成同意與身分確認。【待確認：年齡政策】。",
        },
        {
          heading: "第五條 保存與使用期間",
          body: "通常僅保存至處理目的完成，法律規定須保留的資料按規定期間另行保存。會員、預約、諮詢、診療紀錄、存取紀錄的具體期間及依據：【待確認：逐項期限】。註銷後依法須保留的資訊分開管理。",
        },
        {
          heading: "第六條 向第三方提供",
          body: "除法律允許或經有效同意等合法情況外，不提供個人資料予第三方。如有提供，將說明接收方、目的、項目、保存期間等。【待確認：實際接收方或確認沒有】。",
        },
        {
          heading: "第七條 委託處理",
          body: "如委託網站託管、簡訊、電子郵件、預約系統等業務，依法公開受託方與受託業務並加以監督。【待確認：受託方、業務、再委託情況】。",
        },
        {
          heading: "第八條 跨境傳輸",
          body: "如使用境外雲端、分析或通訊服務並發生跨境傳輸，將依法說明依據、目的地、接收方、資料項目、時間方式、目的、保存期間及相關拒絕權利。【待確認：是否存在跨境傳輸】。",
        },
        {
          heading: "第九條 刪除與銷毀",
          body: "不再需要的資料將及時刪除；依法須保存的另行管理。電子資料以難以還原的方式刪除，紙本採粉碎等適當方式銷毀。",
        },
        {
          heading: "第十條 安全措施",
          body: "依風險採取權限控管、驗證資訊保護、必要加密、日誌管理、安全更新、員工教育及實體保護等措施。【待確認：實際安全措施】。",
        },
        {
          heading: "第十一條 個人權利",
          body: "使用者可依適用法律要求查閱、更正、刪除、停止處理或撤回同意。聯絡方式：【待確認】。本院得核驗申請人身分；依法必須保存的醫療紀錄可能無法立即刪除。",
        },
        {
          heading: "第十二條 Cookie與分析",
          body: "網站可能使用Cookie維持登入狀態及記錄所選語言。可在瀏覽器刪除或封鎖，但部分功能可能受影響。【待確認：實際Cookie、分析及廣告工具、保存期間】。",
        },
        {
          heading: "第十三條 其他利用及自動化決策",
          body: "其他利用或提供必須符合適用法律要求。如使用依法須告知的自動化決策或行為分析，將另行說明相關資訊與權利。【待確認：是否使用】。",
        },
        {
          heading: "第十四條 負責人與申訴",
          body: "個人資料保護負責人：【待確認：姓名及職稱】；部門：【待確認】；電子郵件：【待確認】；電話：【待確認】。在韓國可撥打118諮詢個資侵害問題。",
        },
        {
          heading: "第十五條 生效與修訂",
          body: "生效日期：【待確認】。修訂時公布主要變更與日期，依法需個別通知時另行辦理。歷史版本位置：【待確認】。",
        },
      ],
    },
    terms: {
      title: "服務使用條款",
      lead: "本條款為網站帳戶、線上諮詢與到院預約的通用規則草案。正式施行前須核對實際營運政策。",
      sections: [
        {
          heading: "第一條 目的與營運者",
          body: "規範AHN’S整形外科線上服務的使用條件。登記名稱與聯絡方式：【待確認】。",
        },
        {
          heading: "第二條 定義",
          body: "「服務」包含網站、會員帳戶、諮詢、預約與紀錄查詢；「會員」為已註冊使用者；「預約」僅是到院諮詢時段，不代表手術或診療契約。",
        },
        {
          heading: "第三條 條款公告與修訂",
          body: "本院將條款公告於網站。依法變更時會公布內容與生效日期，必要時另行通知。",
        },
        {
          heading: "第四條 服務與中斷",
          body: "提供院所介紹、帳戶管理、諮詢與預約等功能。維護、故障或安全問題可能導致暫停，能提前告知時將盡量說明。",
        },
        {
          heading: "第五條 註冊與帳戶安全",
          body: "使用者須提供正確資料並保管帳號與密碼。遇詐騙、濫用或安全問題時，得依法限制註冊或使用。",
        },
        {
          heading: "第六條 未成年人",
          body: "依法需要法定代理人同意時將履行相關程序。註冊同意不能代替醫療處置所需的知情同意。",
        },
        {
          heading: "第七條 資料變更與註銷",
          body: "使用者可透過提供的方式更正資料或申請註銷。資料依隱私權政策及法律保存義務處理。",
        },
        {
          heading: "第八條 預約與諮詢",
          body: "線上預約僅為到院諮詢。手術適應性、方案、價格與日期須由醫療諮詢決定，修改與取消依另行公告。",
        },
        {
          heading: "第九條 醫療資訊",
          body: "網站內容屬一般資訊，不是個人診斷。請向醫師瞭解效果、風險及替代方案；緊急情況應尋求緊急醫療協助。",
        },
        {
          heading: "第十條 使用者義務",
          body: "不得冒用身分、虛假預約、侵害隱私或智慧財產權、傳送惡意程式或阻礙網站運作。",
        },
        {
          heading: "第十一條 使用限制",
          body: "對詐欺、安全危害或反覆干擾等情況，得採取必要且適當的限制，並於適當時告知理由與申訴方式。",
        },
        {
          heading: "第十二條 內容與智慧財產",
          body: "網站內容歸合法權利人所有；上傳評價與照片不得侵害他人權利，公開病患照片須符合相關同意及醫療廣告規定。",
        },
        {
          heading: "第十三條 隱私與行銷",
          body: "個人資料依隱私權政策處理，行銷訊息須具合法依據並提供退訂方式。",
        },
        {
          heading: "第十四條 申訴與爭議",
          body: "本條款不排除本院依法應負的責任。申訴管道：【待確認】。爭議依適用法律及適當程序處理。",
        },
        {
          heading: "生效日期",
          body: "【待確認：生效日期及舊版紀錄】。",
        },
      ],
    },
    "non-covered-fees": {
      title: "非健保診療費用及證明文件收費",
      lead: "本頁供公告本院實際收取的非健保診療費用及證明文件費用。未核實的金額不會任意填寫。",
      sections: [
        {
          heading: "一、非健保費用",
          body: "對不屬於相關公共醫療保險給付範圍、由本院實際收費的項目，應公告項目名稱及價格。",
        },
        {
          heading: "二、診療費用表",
          body: "【待確認：正式收費表】。建議包含類別、項目、說明、計價單位、韓元金額、藥品或材料是否包含、備註與更新日期。僅列真實收費項目。",
        },
        {
          heading: "三、證明文件收費",
          body: "【待確認：診斷證明、病歷複本等實際收費表】。列出項目、單位、金額與備註。",
        },
        {
          heading: "四、價格變更與諮詢",
          body: "病患狀況及額外處置可能影響診療計畫。應於診療前說明費用，價格異動時更新公告。",
        },
        {
          heading: "五、聯絡方式",
          body: "收費基準日期：【待確認】；諮詢電話：【待確認】。未公告實際逐項價格前，不能視為已完成法定收費公告。",
        },
      ],
    },
    "patient-rights": {
      title: "患者權利與義務",
      lead: "患者與醫護人員應相互尊重，共同維護安全且透明的醫療環境。",
      sections: [
        {
          heading: "一、接受醫療的權利",
          body: "患者有權受到尊重並接受適當的醫療服務。",
        },
        {
          heading: "二、知情與自主選擇",
          body: "患者有權瞭解診斷、治療方式、預期效果、風險及其他選項，並在理解後決定是否接受。",
        },
        {
          heading: "三、隱私保護",
          body: "與診療有關的個人資訊和隱私受到保護，法律許可的例外情形除外。",
        },
        {
          heading: "四、申訴與救濟",
          body: "患者可提出建議、申訴並請求相關程序說明。【待確認：申訴窗口】。",
        },
        {
          heading: "五、如實提供健康資訊",
          body: "應盡量準確提供病史、過敏、用藥及其他診療所需資訊。",
        },
        {
          heading: "六、尊重他人",
          body: "尊重醫護人員、其他患者，以及院內安全與感染預防規定。",
        },
        {
          heading: "七、遵守預約",
          body: "盡量準時到院，如需更改，請提前聯絡。",
        },
      ],
    },
    "reservation-policy": {
      title: "線上預約與取消說明",
      lead: "線上預約僅用於安排到院諮詢，不代表手術已確定或保證效果。目前網站不收取線上預約訂金。",
      sections: [
        {
          heading: "第一條 預約性質",
          body: "預約僅確定到院諮詢時段，診療方案、費用及手術日期須經諮詢後確認。",
        },
        {
          heading: "第二條 預約方式",
          body: "登入後選擇可預約時間並提交必要資料；系統顯示已確認，即代表諮詢時段預約成功，可於個人頁面查看。",
        },
        {
          heading: "第三條 更改與取消",
          body: "可透過個人頁面的相關功能或聯絡本院辦理。【待確認：取消截止時間、當日規則、修改次數】。現行政策不預設未經確認的取消費用。",
        },
        {
          heading: "第四條 遲到或未到院",
          body: "無法準時到院時請提前通知，依實際安排可能需要調整時段。【待確認：具體程序】。",
        },
        {
          heading: "第五條 院方更改時段",
          body: "如因緊急醫療、醫護排程或設施維護需調整，本院將以可用聯絡方式通知並協商其他時段。【待確認：聯絡方式】。",
        },
        {
          heading: "第六條 費用與付款",
          body: "目前不提供線上預約訂金或治療費預付。費用與支付方式於面診時另行說明；未來增加付款功能時應另訂退款政策。",
        },
        {
          heading: "第七條 個人資料",
          body: "預約資訊依隱私權政策處理；健康敏感資訊須具合法依據及必要的個別告知或同意。",
        },
        {
          heading: "第八條 聯絡與生效",
          body: "預約諮詢：【待確認】；生效日期：【待確認】。",
        },
      ],
    },
  },
};
