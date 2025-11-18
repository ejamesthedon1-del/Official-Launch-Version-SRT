import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { PaymentForm } from "./PaymentForm";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe?: () => void;
  address?: string;
}

export function SubscriptionDialog({ open, onOpenChange, onSubscribe, address = "" }: SubscriptionDialogProps) {
  const [showPayment, setShowPayment] = useState(false);
  
  // Reset payment form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShowPayment(false);
    }
    onOpenChange(newOpen);
  };
  
  const features = [
    "Complete 30-Day Action Plan",
    "Week-by-Week Marketing Strategy",
    "4 Target Buyer Demographic Profiles",
    "Investment ROI Documentation Templates",
    "Rental Income Projection Models",
    "Twilight Photography Session Guide",
    "Strategic Price Positioning Analysis",
    "Austin Metro Luxury Marketing Campaign",
    "VIP Preview Event Planning",
    "Seasonal Timing Compensatory Strategies",
    "Competitive Differentiation Messaging",
    "Enhanced Visual Marketing Package",
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[90%] sm:max-w-sm md:max-w-md max-h-[85vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base text-slate-600">
            Get your complete strategy to increase sale probability from 40% to 85% in 30 days
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 md:p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 text-center">
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-xl md:text-2xl font-bold text-slate-400 line-through">$200</span>
              <span className="text-3xl md:text-4xl font-bold text-blue-600">$99</span>
              <span className="text-base md:text-lg text-slate-600">one-time</span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mb-3">
              Full access • No subscription
            </p>
            <Badge className="bg-blue-600 text-white border-blue-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </Card>

          <div>
            <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3">Everything included:</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-xs md:text-sm text-slate-700 leading-tight">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {!showPayment ? (
            <div className="pt-2 space-y-2">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                size="lg"
                onClick={() => setShowPayment(true)}
              >
                Continue to Payment
              </Button>
              <p className="text-xs text-center text-slate-500">
                Secure payment • 30-day money-back guarantee
              </p>
            </div>
          ) : (
            <div className="pt-2">
              <PaymentForm
                amount={99}
                address={address}
                onSuccess={() => {
                  if (onSubscribe) {
                    onSubscribe();
                  }
                }}
                onCancel={() => setShowPayment(false)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
