import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface InstructionsListProps {
  instructions: string;
}

export function InstructionsList({ instructions }: InstructionsListProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Split instructions into steps (by newline or numbered pattern)
  const steps = instructions
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s.replace(/^\d+[\.\)]\s*/, ""));

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Instructions</h3>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className={cn(
              "flex gap-3 rounded-lg border bg-card p-4 transition-all cursor-pointer",
              completedSteps[index] && "bg-accent/30 border-accent"
            )}
            onClick={() => toggleStep(index)}
          >
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full font-semibold transition-colors",
                  completedSteps[index]
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {completedSteps[index] ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
            <p
              className={cn(
                "flex-1 pt-1",
                completedSteps[index] && "text-muted-foreground line-through"
              )}
            >
              {step}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
