"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  credits: number;
  price: number;
  description: string;
  onSelect: () => void;
  isLoading?: boolean;
}

export function PricingCard({
  credits,
  price,
  description,
  onSelect,
  isLoading,
}: PricingCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">{credits} 크레딧</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-3xl font-bold">${price}</div>
        <div className="text-sm text-muted-foreground mt-1">
          크레딧당 ${(price / credits).toFixed(3)}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSelect} disabled={isLoading}>
          {isLoading ? "처리 중..." : "구매하기"}
        </Button>
      </CardFooter>
    </Card>
  );
}

interface PricingCardsProps {
  onSelectPackage: (creditAmount: "30" | "50" | "100") => void;
  isLoading?: boolean;
}

export function PricingCards({
  onSelectPackage,
  isLoading,
}: PricingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PricingCard
        credits={30}
        price={5}
        description="가끔 사용하는 사용자에게 적합"
        onSelect={() => onSelectPackage("30")}
        isLoading={isLoading}
      />
      <PricingCard
        credits={50}
        price={8}
        description="정기적으로 사용하는 사용자에게 좋은 가치"
        onSelect={() => onSelectPackage("50")}
        isLoading={isLoading}
      />
      <PricingCard
        credits={100}
        price={15}
        description="파워 유저를 위한 최고의 가치"
        onSelect={() => onSelectPackage("100")}
        isLoading={isLoading}
      />
    </div>
  );
}
