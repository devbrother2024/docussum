import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SummaryCompleteEmailProps {
  tldr: string;
  summaryId: string;
}

export const SummaryCompleteEmail = ({
  tldr,
  summaryId,
}: SummaryCompleteEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/dashboard/history/${summaryId}`;

  return (
    <Html>
      <Head />
      <Preview>
        요약이 완료되었습니다. TL;DR를 확인하고 전체 요약을 보세요.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>DocuSumm</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>요약이 완료되었습니다</Heading>
            <Text style={text}>
              요청하신 내용의 요약이 완료되었습니다. 아래 TL;DR를 확인하시고,
              전체 요약을 보시려면 버튼을 클릭해주세요.
            </Text>

            {/* TL;DR Section */}
            <Section style={tldrSection}>
              <Heading style={h2}>TL;DR</Heading>
              <Text style={tldrText}>{tldr}</Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonSection}>
              <Button style={button} href={dashboardUrl}>
                전체 요약 보기
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>DocuSumm</strong> - 문서 요약을 더 쉽게
            </Text>
            <Text style={footerText}>
              이 이메일은 요약 작업 완료 알림을 위해 자동으로 발송되었습니다.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SummaryCompleteEmail;

// 샘플 props (React Email 개발 서버에서 사용)
export const previewProps: SummaryCompleteEmailProps = {
  tldr: `• **핵심 내용**: React와 Next.js를 사용한 모던 웹 애플리케이션 개발에 대한 포괄적인 가이드입니다.

• **주요 기능**: 서버 컴포넌트, 클라이언트 컴포넌트, API 라우트, 그리고 데이터 페칭 전략을 다룹니다.

• **실전 팁**: 성능 최적화, SEO 개선, 그리고 사용자 경험 향상을 위한 베스트 프랙티스를 제공합니다.`,
  summaryId: "550e8400-e29b-41d4-a716-446655440000",
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 24px",
  backgroundColor: "#1a1a1a",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "0.5px",
};

const content = {
  padding: "0 48px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  padding: "0",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "32px 0 16px",
  padding: "0",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const tldrSection = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "24px",
  margin: "32px 0",
};

const tldrText = {
  color: "#1a1a1a",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0",
  whiteSpace: "pre-line" as const,
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1a1a1a",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const footer = {
  padding: "0 48px",
  marginTop: "48px",
  borderTop: "1px solid #e6ebf1",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "16px 0 0",
  textAlign: "center" as const,
};
