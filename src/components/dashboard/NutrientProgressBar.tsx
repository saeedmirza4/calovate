
import { cn } from "@/lib/utils";

interface NutrientProgressBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit?: string;
}

const NutrientProgressBar = ({
  label,
  current,
  goal,
  color,
  unit = "g",
}: NutrientProgressBarProps) => {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">
          {current}{unit} / {goal}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={cn("h-2.5 rounded-full", {
            "bg-green-500": color === "green",
            "bg-blue-500": color === "blue",
            "bg-yellow-500": color === "yellow",
            "bg-red-500": color === "red",
            "bg-purple-500": color === "purple",
          })}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default NutrientProgressBar;
