import BoardDetailClient from "./BoardDetailClient";

export function generateStaticParams() {
  // 예시: 빌드 시 생성할 게시판 번호
  return [{ id: "1" }];
}

export default function Page() {
  return <BoardDetailClient />;
}
