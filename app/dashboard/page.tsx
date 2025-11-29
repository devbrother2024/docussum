"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InputPanel } from "./components/input-panel";
import { SummaryCard, SummaryResult } from "./components/summary-card";
import { SummarySkeleton } from "./components/summary-skeleton";
import { Separator } from "@/components/ui/separator";
import { generateSummary } from "@/actions/summarize";

function PaymentHandler() {
  const searchParams = useSearchParams();
  const paymentProcessed = useRef(false);

  // Handle payment success/cancelled notifications
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    // Prevent duplicate processing
    if (paymentProcessed.current) return;

    if (paymentStatus === "success") {
      paymentProcessed.current = true;
      alert("크레딧 충전이 완료되었습니다!");
      // Remove query parameter without triggering re-render
      window.history.replaceState(null, "", "/dashboard");
    } else if (paymentStatus === "cancelled") {
      paymentProcessed.current = true;
      // Silently handle cancellation
      window.history.replaceState(null, "", "/dashboard");
    }
  }, [searchParams]);

  return null;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(
    null
  );

  const handleSummarize = async (type: "text" | "youtube", content: string) => {
    setIsLoading(true);
    setSummaryResult(null);

    try {
      const result = await generateSummary(content, type);

      if (result.success && result.data) {
        setSummaryResult(result.data);
      } else {
        console.error(result.error);
        alert(`Error: ${result.error}`); // Simple alert for now
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-10 px-4 md:px-6 space-y-10">
      <Suspense fallback={null}>
        <PaymentHandler />
      </Suspense>
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          AI로 모든 것을 요약하세요
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          긴 문서도, YouTube 영상도 단 몇 초 만에 핵심만 파악할 수 있습니다.
        </p>
      </div>

      <InputPanel onSummarize={handleSummarize} isLoading={isLoading} />

      {(isLoading || summaryResult) && (
        <>
          <Separator className="w-full max-w-3xl" />
          <div className="w-full">
            {isLoading ? (
              <SummarySkeleton />
            ) : (
              summaryResult && <SummaryCard result={summaryResult} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
