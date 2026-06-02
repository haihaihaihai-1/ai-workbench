import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Brain, Heart, Smile, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { ActivityPanel } from "./user-profile/activity-panel";
import { BasicInfoCard } from "./user-profile/basic-info-card";
import { CommunicationPrefCard } from "./user-profile/communication-pref-card";
import { EmotionPanel } from "./user-profile/emotion-panel";
import { InterestsPanel } from "./user-profile/interests-panel";
import { KeyMetrics } from "./user-profile/key-metrics";
import { LearningStylePanel } from "./user-profile/learning-style-panel";
import { MOCK_USER } from "./user-profile/mock-data";
import { ProfileHeader } from "./user-profile/profile-header";
import { ProfileSummary } from "./user-profile/profile-summary";
import { QuickActions } from "./user-profile/quick-actions";
import { RiskAssessmentCard } from "./user-profile/risk-assessment-card";

const TABS = [
  { id: "interests", label: "兴趣与偏好", icon: Heart },
  { id: "activity", label: "活跃模式", icon: Activity },
  { id: "emotion", label: "情绪追踪", icon: Smile },
  { id: "learning", label: "学习风格", icon: Brain },
] as const;

export default function UserProfilePage() {
  const { userId } = useParams();
  const user = MOCK_USER;
  // userId 仅作为 URL 标识，profile 数据从 mock 加载
  void userId;

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader />
      <ProfileSummary />
      <KeyMetrics />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* 左侧主内容：4 个 Tab 面板 */}
        <div className="min-w-0">
          <Tabs defaultValue="interests" className="w-full">
            <TabsList className="h-9 w-full justify-start gap-1">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="h-7 gap-1.5 px-3 text-xs data-[state=active]:bg-card"
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="interests" className="mt-3">
              <InterestsPanel />
            </TabsContent>
            <TabsContent value="activity" className="mt-3">
              <ActivityPanel />
            </TabsContent>
            <TabsContent value="emotion" className="mt-3">
              <EmotionPanel />
            </TabsContent>
            <TabsContent value="learning" className="mt-3">
              <LearningStylePanel />
            </TabsContent>
          </Tabs>
        </div>

        {/* 右侧栏：基础信息 / 风险 / 沟通 / 快速操作 */}
        <div className="flex flex-col gap-4">
          <BasicInfoCard />
          <RiskAssessmentCard />
          <CommunicationPrefCard />
          <QuickActions />

          {/* 底部：当前用户简要 */}
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3 text-[10px] leading-relaxed text-muted-foreground">
            <div className="mb-1 flex items-center gap-1 font-semibold text-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              数据来源
            </div>
            画像由 {user.totalMemories} 条记忆 + {user.totalSessions} 次会话聚合生成，置信度
            87%。最后更新：
            {new Date().toLocaleString("zh-CN", { hour12: false })}
          </div>
        </div>
      </div>
    </div>
  );
}
