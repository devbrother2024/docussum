import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  // 이 테스트 그룹은 로그인하지 않은 상태에서 실행되어야 함
  test.use({ storageState: { cookies: [], origins: [] } });

  test("로그인 페이지가 정상적으로 렌더링됩니다", async ({ page }) => {
    await page.goto("/login");

    // 페이지 제목 확인
    await expect(
      page.getByText("DocuSumm에 오신 것을 환영합니다")
    ).toBeVisible();

    // Google 로그인 버튼 확인
    await expect(
      page.getByRole("button", { name: /Google로 시작하기/i })
    ).toBeVisible();

    // 서비스 이용약관 링크 확인
    await expect(page.getByText("서비스 이용약관")).toBeVisible();
  });

  test("루트 경로 접속 시 로그인 페이지로 리다이렉트됩니다", async ({
    page,
  }) => {
    await page.goto("/");

    // 로그인 페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL(/.*\/login/);
  });
});
