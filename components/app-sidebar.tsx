import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FileText, Link2, Plus, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { getHistory } from "@/app/dashboard/components/history-list";
import { getUserInfo } from "@/app/dashboard/components/user-info";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { logout } from "@/app/dashboard/actions/logout";
import { CreditTopupDialog } from "@/app/dashboard/components/credit-topup-dialog";

function formatDate(date: Date) {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  } else if (diffInHours < 168) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  } else {
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  }
}

function getTitleFromTldr(tldr: string | null): string {
  if (!tldr) return "제목 없음";
  // Extract first line or first bullet point
  const firstLine = tldr.split("\n")[0].trim();
  // Remove markdown bullets and clean up
  const cleaned = firstLine
    .replace(/^[-*•]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
  return cleaned.length > 50 ? cleaned.substring(0, 50) + "..." : cleaned;
}

function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>로그아웃</span>
      </button>
    </form>
  );
}

export async function AppSidebar() {
  const historyItems = await getHistory();
  const userInfo = await getUserInfo();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            D
          </div>
          <span className="font-bold text-xl">DocuSumm</span>
        </div>
        <Button className="w-full justify-start" variant="outline" asChild>
          <Link href="/dashboard">
            <Plus className="mr-2 h-4 w-4" />
            New Summary
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {historyItems.length === 0 ? (
                <SidebarMenuItem>
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    아직 요약 내역이 없습니다.
                  </div>
                </SidebarMenuItem>
              ) : (
                historyItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/dashboard/history/${item.id}`}
                        className="flex items-center gap-2"
                      >
                        {item.type === "text" ? (
                          <FileText className="h-4 w-4 opacity-70" />
                        ) : (
                          <Link2 className="h-4 w-4 opacity-70" />
                        )}
                        <span
                          className="truncate flex-1"
                          title={getTitleFromTldr(item.tldr)}
                        >
                          {getTitleFromTldr(item.tldr)}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 space-y-2">
        {userInfo && (
          <div className="px-2 py-2 text-sm">
            <div className="text-muted-foreground text-xs mb-1">크레딧</div>
            <div className="font-semibold text-lg">{userInfo.credits}개</div>
            <div className="text-muted-foreground text-xs mt-1 truncate">
              {userInfo.email}
            </div>
            <CreditTopupDialog />
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
