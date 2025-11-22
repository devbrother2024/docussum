import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SummaryCard } from "../../components/summary-card";

// Mock Data for specific history item (In real app, fetch by ID)
const mockHistoryData = {
  id: "1",
  tldr: `
- **핵심 포인트 1**: Next.js 16은 React 19 RC를 포함하며, Server Actions가 안정화되었습니다.
- **핵심 포인트 2**: Turbopack이 기본적으로 활성화되어 개발 서버 속도가 대폭 향상되었습니다.
- **핵심 포인트 3**: 새로운 훅(useActionState 등)을 통해 폼 핸들링이 더욱 간편해졌습니다.
  `.trim(),
  content: `
## Next.js 16 주요 변경 사항

Next.js 16은 성능과 개발자 경험(DX)에 중점을 둔 메이저 업데이트입니다.

### 1. React 19 RC 지원
React의 최신 기능을 미리 사용할 수 있으며, 특히 Server Components와 Client Components 간의 경계가 더욱 명확해졌습니다.

### 2. Server Actions 안정화
이제 실험적 기능이 아닌 정식 기능으로, 폼 제출 및 데이터 변형(Mutation)을 클라이언트 자바스크립트 없이도 처리할 수 있습니다.

### 3. Turbopack
Rust 기반의 번들러인 Turbopack이 안정화 단계에 접어들어, 'next dev' 실행 시 기존 Webpack 대비 최대 700배 빠른 속도를 자랑합니다.

### 4. 메타데이터 개선
SEO를 위한 메타데이터 API가 더욱 직관적으로 변경되었으며, 동적 Open Graph 이미지 생성이 쉬워졌습니다.
  `.trim(),
  createdAt: "2024-05-20",
  type: "text",
};

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // In a real implementation, we would fetch data using the ID
  // const data = await fetchSummaryById(id);
  console.log("Fetching history for ID:", id);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-10 px-4 md:px-6 space-y-6">
      <div className="w-full flex items-center justify-start">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="w-full space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="uppercase tracking-wider font-semibold text-xs bg-secondary px-2 py-1 rounded">
            {mockHistoryData.type}
          </span>
          <span>•</span>
          <span>{mockHistoryData.createdAt}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Next.js 16 업데이트 정리</h1>
      </div>

      <div className="w-full">
        <SummaryCard result={mockHistoryData} />
      </div>
    </div>
  );
}

