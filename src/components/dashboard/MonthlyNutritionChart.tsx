
import React, { useMemo } from "react";
import { FoodItem } from "@/contexts/FoodContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

interface MonthlyNutritionChartProps {
  foods: FoodItem[];
}

const MonthlyNutritionChart: React.FC<MonthlyNutritionChartProps> = ({ foods }) => {
  const chartData = useMemo(() => {
    // Get current month date range
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    
    // Create array with all days of the month
    const daysInMonth = eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    });
    
    // Map each day to its nutritional data
    return daysInMonth.map(date => {
      // Filter foods consumed on this day
      const dayFoods = foods.filter(food => {
        const foodDate = parseISO(food.date);
        return isSameDay(foodDate, date);
      });
      
      // Calculate daily totals
      const dailyTotals = dayFoods.reduce(
        (acc, food) => {
          return {
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbs: acc.carbs + food.carbs,
            fat: acc.fat + food.fat,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      
      return {
        date: format(date, "dd"),
        fullDate: format(date, "MMM dd"),
        ...dailyTotals,
      };
    });
  }, [foods]);

  const chartConfig = {
    calories: { label: "Calories", color: "#4ade80" },
    protein: { label: "Protein", color: "#60a5fa" },
    carbs: { label: "Carbs", color: "#facc15" },
    fat: { label: "Fat", color: "#a855f7" },
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer
        config={chartConfig}
        className="w-full h-full"
      >
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value}
          />
          <YAxis />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    labelFormatter={(label) => {
                      const item = payload[0]?.payload;
                      return item ? item.fullDate : label;
                    }}
                  />
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="calories" name="Calories" fill="#4ade80" />
          <Bar dataKey="protein" name="Protein" fill="#60a5fa" />
          <Bar dataKey="carbs" name="Carbs" fill="#facc15" />
          <Bar dataKey="fat" name="Fat" fill="#a855f7" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default MonthlyNutritionChart;
