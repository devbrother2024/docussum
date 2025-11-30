"use client";

import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      // 프로덕션에서는 환경 변수 사용, 개발 환경에서는 window.location.origin 사용
      const redirectTo =
        process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectTo}/auth/callback`,
        },
      });

      if (error) {
        console.error("Login error:", error);
        Sentry.captureException(error);
        alert("로그인 중 오류가 발생했습니다: " + error.message);
        setIsLoading(false);
      }
      // 성공 시 리다이렉트되므로 여기서는 아무것도 하지 않음
    } catch (error) {
      console.error("Unexpected error:", error);
      Sentry.captureException(error);
      alert("예상치 못한 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-xl font-bold">D</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            DocuSumm에 오신 것을 환영합니다
          </CardTitle>
          <CardDescription>
            AI로 모든 것을 요약하세요. Google 계정으로 시작하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "로그인 중..." : "Google로 시작하기"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            로그인하면{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              서비스 이용약관
            </Link>
            과{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              개인정보 처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
