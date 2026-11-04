import type { AppLocale } from "@/i18n/config";

/**
 * 법적 안내 페이지 본문이 변경되면 반드시 이 버전도 갱신하고,
 * 백엔드의 동의 이력과 같은 정책 버전을 사용해 주세요.
 * DRAFT 상태: 실제 병원 검토 후 정식 버전으로 바꾸어야 합니다.
 */
export const CONSENT_POLICY_VERSION = "2026-11-04-draft";

type RegistrationConsentCopy = {
  allRequired: string;
  termsLabel: string;
  privacyLabel: string;
  required: string;
  optional: string;
  termsSummary: string;
  privacySummary: string;
  readTerms: string;
  readPrivacy: string;
  emailMarketing: string;
  smsMarketing: string;
  notice: string;
};

export const registrationConsentCopy: Record<
  AppLocale,
  RegistrationConsentCopy
> = {
  ko: {
    allRequired: "필수 항목 전체 확인 및 동의",
    termsLabel: "서비스 이용약관 동의",
    privacyLabel: "회원정보 처리 안내 확인",
    required: "필수",
    optional: "선택",
    termsSummary:
      "회원 계정의 생성·이용·탈퇴와 서비스 운영에 관한 사항을 정합니다. 아래 전문을 열어 내용을 확인해 주세요. 약관의 실제 적용 범위와 정책은 운영 전 확정되어야 합니다.",
    privacySummary:
      "회원 식별과 계정 운영을 위해 이름·아이디·비밀번호·이메일을 처리합니다. 연락처·성별·주소는 화면상 선택 항목입니다. 보유 기간, 위탁·제공 등 자세한 사항은 개인정보처리방침을 확인해 주세요. 법적 근거와 실제 항목·기간은 운영 전에 확정해야 합니다.",
    readTerms: "이용약관 전문 보기",
    readPrivacy: "개인정보처리방침 전문 보기",
    emailMarketing: "이벤트 및 광고성 이메일 수신 동의",
    smsMarketing: "이벤트 및 광고성 SMS 수신 동의",
    notice:
      "선택 항목에 동의하지 않아도 가입할 수 있습니다. 약관 및 개인정보 안내는 운영 전 실제 병원 정책에 맞게 최종 검토해야 합니다.",
  },
  en: {
    allRequired: "Agree to required terms and acknowledge the notice",
    termsLabel: "Agree to Terms of Service",
    privacyLabel: "Acknowledge member data notice",
    required: "Required",
    optional: "Optional",
    termsSummary:
      "The terms describe how membership accounts and services work, including registration and termination. Please review the full document. Clinic-specific terms must be approved before launch.",
    privacySummary:
      "We process your name, account ID, password and email for account services. Phone, gender and address are optional on this form. See the full privacy policy for details. Actual retention and legal basis require verification.",
    readTerms: "Read full terms",
    readPrivacy: "Read privacy policy",
    emailMarketing: "Receive promotional emails",
    smsMarketing: "Receive promotional SMS",
    notice:
      "Marketing consent is optional. The clinic must review these documents against its actual practices before launch.",
  },
  ja: {
    allRequired: "必須事項に同意・確認する",
    termsLabel: "利用規約への同意",
    privacyLabel: "会員情報の取扱いに関する確認",
    required: "必須",
    optional: "任意",
    termsSummary:
      "会員登録、サービス利用、退会に関する事項を定めています。全文をご確認ください。正式な運用規定は公開前に確認が必要です。",
    privacySummary:
      "会員管理のため氏名、ID、パスワード、メールアドレスを取り扱います。電話番号、性別、住所は任意項目です。保存期間や取扱いの詳細は個人情報処理方針をご確認ください。",
    readTerms: "利用規約全文を見る",
    readPrivacy: "個人情報処理方針を見る",
    emailMarketing: "広告・イベントメールを受信する",
    smsMarketing: "広告・イベントSMSを受信する",
    notice:
      "広告配信への同意は任意です。公開前に実際の病院の運用内容と照合してください。",
  },
  "zh-CN": {
    allRequired: "同意并确认必需事项",
    termsLabel: "同意服务条款",
    privacyLabel: "确认会员信息处理说明",
    required: "必需",
    optional: "可选",
    termsSummary:
      "本条款规定会员注册、服务使用及注销等事项。请阅读完整条款。正式发布前须与医院实际运营政策核实。",
    privacySummary:
      "为管理会员账户，我们处理姓名、账号、密码和邮箱。电话、性别及地址为可选项。有关保存期限和处理详情，请阅读隐私政策。",
    readTerms: "查看完整服务条款",
    readPrivacy: "查看隐私政策",
    emailMarketing: "同意接收营销邮件",
    smsMarketing: "同意接收营销短信",
    notice: "营销同意为可选项。发布前须与医院实际政策核实。",
  },
  "zh-TW": {
    allRequired: "同意並確認必要事項",
    termsLabel: "同意服務條款",
    privacyLabel: "確認會員資料處理說明",
    required: "必要",
    optional: "選填",
    termsSummary:
      "本條款規範會員註冊、服務使用及註銷等事項。請閱讀完整條款。正式上線前須與院所實際政策核實。",
    privacySummary:
      "為管理會員帳戶，我們處理姓名、帳號、密碼及電子郵件。電話、性別與地址為選填項目。保存期間及處理詳情請參閱隱私權政策。",
    readTerms: "查看完整服務條款",
    readPrivacy: "查看隱私權政策",
    emailMarketing: "同意接收行銷電子郵件",
    smsMarketing: "同意接收行銷簡訊",
    notice: "行銷同意是選填項目。發布前須確認院所實際政策。",
  },
};
