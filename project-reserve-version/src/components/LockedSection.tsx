import { Lock, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface LockedSectionProps {
  onSubscribe: () => void;
}

export function LockedSection({ onSubscribe }: LockedSectionProps) {
  return (
    <Card className="p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm z-10" />
      
      <div className="relative z-20 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" />
          Premium Feature
        </Badge>
        
        <h2 className="mb-3">Complete 30-Day Action Plan</h2>
        <p className="text-muted-foreground mb-6">
          Unlock your week-by-week marketing strategy with specific pricing recommendations, 
          target buyer profiles, investment documentation templates, and proven tactics 
          tailored to sell your Lake Travis property within 30 days.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Week-by-Week Strategy</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Buyer Demographic Profiles</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>ROI Documentation</span>
          </div>
        </div>
        
        <Button size="lg" onClick={onSubscribe} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Subscribe to Unlock
        </Button>
      </div>
      
      {/* Blurred preview content in background */}
      <div className="absolute inset-0 opacity-20 blur-md p-8">
        <div className="space-y-4">
          <div className="h-4 bg-foreground/20 rounded w-3/4" />
          <div className="h-4 bg-foreground/20 rounded w-full" />
          <div className="h-4 bg-foreground/20 rounded w-5/6" />
          <div className="h-32 bg-foreground/20 rounded mt-6" />
          <div className="h-4 bg-foreground/20 rounded w-2/3" />
        </div>
      </div>
    </Card>
  );
}
