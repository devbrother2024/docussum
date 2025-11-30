"use server";

import * as Sentry from "@sentry/nextjs";
import { resend } from "@/lib/resend/client";
import { render } from "@react-email/render";
import SummaryCompleteEmail from "@/emails/summary-complete";

interface SendSummaryEmailParams {
  to: string;
  tldr: string;
  summaryId: string;
}

export async function sendSummaryEmail({
  to,
  tldr,
  summaryId,
}: SendSummaryEmailParams) {
  try {
    const emailHtml = await render(
      SummaryCompleteEmail({
        tldr,
        summaryId,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "[DocuSumm] 요약이 완료되었습니다",
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send email:", error);
      Sentry.captureException(error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    Sentry.captureException(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
