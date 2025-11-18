import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface RatingCardProps {
  title: string;
  score: number;
  maxScore: number;
  category: string;
  description: string;
}

export function RatingCard({ title, score, maxScore, category, description }: RatingCardProps) {
  const percentage = (score / maxScore) * 100;
  const getBadgeVariant = (percent: number) => {
    if (percent >= 80) return "default";
    if (percent >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        <Badge variant={getBadgeVariant(percentage)}>
          {score}/{maxScore}
        </Badge>
      </div>
      <Progress value={percentage} className="mb-3" />
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
