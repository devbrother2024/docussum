import { test, expect } from "@playwright/test";

test.describe("Summary Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("텍스트 요약 요청 및 결과 표시 확인", async ({ page }) => {
    // 1. 텍스트 입력창 찾기 및 입력
    const textarea = page.getByPlaceholder(
      "요약하고 싶은 텍스트를 입력하세요..."
    );
    await expect(textarea).toBeVisible();

    // 충분히 긴 텍스트 입력 (너무 짧으면 API에서 거부할 수도 있으므로)
    const testText = `
      Playwright는 Microsoft에서 개발한 오픈 소스 자동화 라이브러리입니다. 
      Playwright는 Chromium, WebKit, Firefox를 포함한 모든 최신 렌더링 엔진을 지원합니다.
      단일 API로 모바일 웹과 데스크톱 웹을 모두 테스트할 수 있어 매우 강력합니다.
      또한 자동 대기(Auto-wait) 기능을 제공하여 불안정한 테스트(Flaky test)를 줄여줍니다.
      헤드리스 모드와 헤드풀 모드를 모두 지원하며, CI/CD 파이프라인에 쉽게 통합할 수 있습니다.
    `;
    await textarea.fill(testText);

    // 2. 요약하기 버튼 클릭
    const submitButton = page.getByRole("button", { name: "요약하기" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 3. 로딩 상태 확인 ("요약 중...")
    await expect(
      page.getByRole("button", { name: "요약 중..." })
    ).toBeVisible();

    // 4. 결과 확인 (타임아웃 120초 설정 - AI 응답 시간 고려)
    // TL;DR 섹션 확인
    await expect(page.getByText("3줄 요약 (TL;DR)")).toBeVisible({
      timeout: 120000,
    });

    // 상세 요약 헤더 확인
    await expect(
      page.getByRole("heading", { name: "상세 요약" })
    ).toBeVisible();

    // 복사 버튼 확인
    await expect(
      page.getByRole("button", { name: "Copy summary" })
    ).toBeVisible();
  });

  test("입력값이 없으면 요약 버튼이 비활성화되어야 합니다", async ({
    page,
  }) => {
    const submitButton = page.getByRole("button", { name: "요약하기" });

    // 초기 상태 (빈 값)
    await expect(submitButton).toBeDisabled();

    // 공백 입력
    await page
      .getByPlaceholder("요약하고 싶은 텍스트를 입력하세요...")
      .fill("   ");
    await expect(submitButton).toBeDisabled();

    // 유효한 텍스트 입력
    await page
      .getByPlaceholder("요약하고 싶은 텍스트를 입력하세요...")
      .fill("Test Content");
    await expect(submitButton).toBeEnabled();
  });
});
