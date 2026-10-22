import * as S from "@/assets/css/auth/Auth.styles";

type AuthBrandPanelProps = {
  mode: "login" | "register";
};

/** 로그인과 회원가입이 같은 브랜드 경험을 공유한다. 외부 이미지 파일은 필요 없다. */
export default function AuthBrandPanel({ mode }: AuthBrandPanelProps) {
  return (
    <S.BrandPanel aria-label="Ahn's 브랜드 소개">
      <S.BrandHome href="/" aria-label="Ahn's 홈으로 이동">
        <S.BrandHomeMark aria-hidden="true">A</S.BrandHomeMark>
        AHN&apos;S
      </S.BrandHome>

      <S.BrandHero>
        <S.BrandEyebrow>THE ART OF YOUR OWN BEAUTY — AHN&apos;S</S.BrandEyebrow>
        {mode === "login" ? (
          <S.BrandTitle>
            Beauty begins{"\n"}
            <em>with you.</em>
          </S.BrandTitle>
        ) : (
          <S.BrandTitle>
            Your story,{"\n"}
            <em>beautifully told.</em>
          </S.BrandTitle>
        )}
        <S.BrandDescription>
          정해진 아름다움이 아닌, 당신만의 조화와 가치.
          <br />그 여정을 Ahn&apos;s와 함께 시작하세요.
        </S.BrandDescription>
      </S.BrandHero>

      <S.BrandBottom>
        <span>A PERSONAL BEAUTY EXPERIENCE</span>
        <span>SEOUL · AHN&apos;S</span>
      </S.BrandBottom>
    </S.BrandPanel>
  );
}
