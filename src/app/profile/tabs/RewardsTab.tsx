// app/profile/tabs/RewardsTab.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { UserData } from "../types";

interface RewardsTabProps {
  userData: UserData;
  totalPoints: number;
  activeRewardCycle: UserData["rewardPoints"][0] | undefined;
}

const RewardsTab = ({
  userData,
  totalPoints,
  activeRewardCycle,
}: RewardsTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Poin Reward
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Points */}
          <div className="text-center p-6 bg-gradient-card rounded-lg">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="text-4xl font-bold text-foreground mb-2">
              {totalPoints}
            </div>
            <p className="text-muted-foreground">Total Poin Reward</p>
            {activeRewardCycle && (
              <p className="text-sm text-muted-foreground mt-2">
                Periode Aktif: {activeRewardCycle.rewardCycle.title}
              </p>
            )}
          </div>

          {/* Reward History */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Riwayat Poin
            </h4>
            <div className="space-y-3">
              {userData.rewardPoints.map((rp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{rp.rewardCycle.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {rp.rewardCycle.isActive
                        ? "Sedang berjalan"
                        : "Telah berakhir"}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    +{rp.points} poin
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RewardsTab;
