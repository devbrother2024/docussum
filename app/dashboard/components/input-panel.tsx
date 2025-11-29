import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputPanelProps {
  onSummarize: (type: "text" | "youtube", content: string) => void;
  isLoading: boolean;
}

export function InputPanel({ onSummarize, isLoading }: InputPanelProps) {
  const [activeTab, setActiveTab] = useState<"text" | "youtube">("text");
  const [textContent, setTextContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(true);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    // Simple YouTube URL validation regex
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    setIsUrlValid(url === "" || youtubeRegex.test(url));
  };

  const handleSubmit = () => {
    if (activeTab === "text") {
      if (!textContent.trim()) return;
      onSummarize("text", textContent);
    } else {
      if (!youtubeUrl.trim() || !isUrlValid) return;
      onSummarize("youtube", youtubeUrl);
    }
  };

  const isSubmitDisabled =
    isLoading ||
    (activeTab === "text" && !textContent.trim()) ||
    (activeTab === "youtube" && (!youtubeUrl.trim() || !isUrlValid));

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <Tabs
        defaultValue="text"
        onValueChange={(value) => setActiveTab(value as "text" | "youtube")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            YouTube
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="요약하고 싶은 텍스트를 입력하세요..."
              className="min-h-[200px] resize-none p-4 text-base"
              value={textContent}
              onChange={handleTextChange}
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {textContent.length} characters
            </div>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="YouTube 영상 URL을 붙여넣으세요 (예: https://youtube.com/watch?v=...)"
              value={youtubeUrl}
              onChange={handleUrlChange}
              className={cn(
                "h-12 text-base",
                !isUrlValid &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              disabled={isLoading}
            />
            {!isUrlValid && (
              <p className="text-sm text-destructive px-1">
                유효한 YouTube URL을 입력해주세요.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Button
        className="w-full h-12 text-lg font-medium"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            요약 중...
          </>
        ) : (
          "요약하기"
        )}
      </Button>
    </div>
  );
}
