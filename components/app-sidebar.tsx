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
import { FileText, Link2, Plus, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

// Mock Data for History
const historyItems = [
  {
    id: 1,
    title: "Next.js 16 업데이트 정리",
    type: "text",
    date: "Today",
  },
  {
    id: 2,
    title: "YouTube: AI의 미래",
    type: "youtube",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "스타트업 펀딩 가이드",
    type: "text",
    date: "Previous 7 Days",
  },
  {
    id: 4,
    title: "React Server Components 설명",
    type: "youtube",
    date: "Previous 7 Days",
  },
];

export function AppSidebar() {
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
              {historyItems.map((item) => (
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
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>My Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
