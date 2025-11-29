"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PricingCards } from "./pricing-cards";
import { createCheckoutSession } from "@/actions/stripe";
import type { CreditPackage } from "@/lib/stripe";

export function CreditTopupDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPackage = async (creditAmount: CreditPackage) => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession(creditAmount);
      if (result.success && result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        alert(result.error || "결제 세션 생성에 실패했습니다.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("결제 세션 생성 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-2">
          충전하기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>크레딧 충전</DialogTitle>
          <DialogDescription>
            원하는 크레딧 패키지를 선택하여 결제를 진행하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <PricingCards
            onSelectPackage={handleSelectPackage}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
