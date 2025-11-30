import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  // 테스트 시작 전 대시보드로 이동 (이미 로그인된 상태)
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("대시보드 페이지 요소 확인", async ({ page }) => {
    await expect(page.getByText("AI로 모든 것을 요약하세요")).toBeVisible({
      timeout: 10000,
    });

    await expect(
      page.getByText(
        "긴 문서도, YouTube 영상도 단 몇 초 만에 핵심만 파악할 수 있습니다."
      )
    ).toBeVisible();
  });

  test("입력 패널 표시 확인", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await expect(textarea).toBeVisible({ timeout: 10000 });
  });

  test("사이드바 표시 확인", async ({ page }) => {
    const sidebar = page.locator("[data-slot='sidebar']").first();
    await expect(sidebar).toBeVisible({ timeout: 10000 });
  });
});
