import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page, browser }) => {
  // 1. 기존 인증 파일이 있는지 확인
  if (fs.existsSync(authFile)) {
    try {
      console.log("🔄 기존 인증 정보를 확인합니다...");
      // 새 컨텍스트에 기존 쿠키 로드
      const context = await browser.newContext({ storageState: authFile });
      const newPage = await context.newPage();

      // 대시보드로 이동해서 로그인이 풀렸는지 확인
      await newPage.goto("/dashboard");

      // 로그인 상태라면 대시보드 텍스트가 보여야 함
      try {
        await expect(
          newPage.getByText("AI로 모든 것을 요약하세요")
        ).toBeVisible({ timeout: 5000 });
        console.log("✅ 기존 인증 정보가 유효합니다. 로그인을 건너뜁니다.");
        return; // 테스트 종료 (성공)
      } catch (e) {
        console.log("⚠️ 기존 인증 정보가 만료되었습니다. 다시 로그인합니다.");
      } finally {
        await context.close();
      }
    } catch (e) {
      console.log("⚠️ 인증 파일 확인 중 오류 발생. 다시 로그인합니다.");
    }
  }

  // 2. 인증 파일이 없거나 만료된 경우 로그인 절차 진행
  // 수동 로그인을 위해 타임아웃을 넉넉하게 설정 (5분)
  setup.setTimeout(300000);

  console.log("🔑 인증 프로세스 시작...");

  // 로그인 페이지로 이동
  await page.goto("/login", { waitUntil: "networkidle", timeout: 60000 });

  console.log("\n===========================================");
  console.log("브라우저가 열렸습니다!");
  console.log("1. 'Google로 시작하기' 버튼을 클릭하세요");
  console.log("2. Google 로그인을 완료하세요");
  console.log("3. 대시보드로 리다이렉트되면 자동으로 인증 상태가 저장됩니다");
  console.log("===========================================\n");

  // 대시보드로 리다이렉트될 때까지 대기
  await page.waitForURL("**/dashboard", { timeout: 300000 });

  // 대시보드 로드 확인
  await expect(page.getByText("AI로 모든 것을 요약하세요")).toBeVisible({
    timeout: 10000,
  });

  // 세션 저장 대기 (안전하게)
  console.log("💾 세션 저장 중...");
  await page.waitForTimeout(3000);

  // 로컬 스토리지 확인 (디버깅용)
  const localStorage = await page.evaluate((): string =>
    JSON.stringify(localStorage)
  );
  console.log("저장된 LocalStorage 크기:", localStorage.length);

  // 인증 상태를 파일에 저장
  await page.context().storageState({ path: authFile });
  console.log("✅ 인증 상태가 저장되었습니다:", authFile);
});
