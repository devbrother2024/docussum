import { defineConfig, devices } from "@playwright/test";
import path from "path";

// 인증 파일 절대 경로
const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json");

// 환경 변수로 테스트 환경 선택 (기본값: production)
const BASE_URL = process.env.E2E_BASE_URL || "https://docussum.vercel.app";
const IS_LOCAL = BASE_URL.includes("localhost");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: BASE_URL,
    trace: "on",
    screenshot: "on",
    video: "on",

    // 시스템 Chrome 사용 (Google 로그인 보안 이슈 해결)
    channel: "chrome",
    headless: false,

    launchOptions: {
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-infobars",
        "--start-maximized",
      ],
      ignoreDefaultArgs: ["--enable-automation"],
    },
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    // 1. 인증 설정 (로그인 수행)
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // 2. 실제 테스트 (인증 정보 사용)
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        // 모든 테스트에 인증 정보 주입
        storageState: STORAGE_STATE,
      },
      dependencies: ["setup"], // setup이 먼저 실행됨
    },
  ],

  // 로컬 테스트 시에만 개발 서버 시작
  ...(IS_LOCAL && {
    webServer: {
      command: "pnpm dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  }),
});
