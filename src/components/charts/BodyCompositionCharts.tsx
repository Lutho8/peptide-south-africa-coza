import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartConfig 
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyComposition } from '@/services/storage';
import { Activity, Flame, Heart, Zap } from 'lucide-react';

interface BodyCompositionChartsProps {
  history: BodyComposition[];
}

const weightFatConfig: ChartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(187, 78%, 55%)", // cyan
  },
  bodyFat: {
    label: "Body Fat (%)",
    color: "hsl(0, 84%, 60%)", // red
  },
};

const muscleConfig: ChartConfig = {
  muscleMass: {
    label: "Muscle Mass (kg)",
    color: "hsl(160, 84%, 39%)", // emerald
  },
  skeletalMuscle: {
    label: "Skeletal Muscle (%)",
    color: "hsl(262, 83%, 58%)", // violet
  },
};

const metabolicConfig: ChartConfig = {
  bmr: {
    label: "BMR (kcal)",
    color: "hsl(262, 83%, 58%)", // violet
  },
  visceralFat: {
    label: "Visceral Fat",
    color: "hsl(25, 95%, 53%)", // orange
  },
};

export function BodyCompositionCharts({ history }: BodyCompositionChartsProps) {
  const [activeTab, setActiveTab] = useState('weight');

  // Reverse history so oldest is first (for left-to-right timeline)
  const chartData = [...history].reverse().map((entry) => ({
    ...entry,
    date: entry.date.slice(5), // Format as MM-DD
  }));

  if (chartData.length < 2) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Need at least 2 entries to show trend charts.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="weight" className="gap-1 text-xs">
            <Flame size={14} />
            Weight & Fat
          </TabsTrigger>
          <TabsTrigger value="muscle" className="gap-1 text-xs">
            <Activity size={14} />
            Muscle
          </TabsTrigger>
          <TabsTrigger value="metabolic" className="gap-1 text-xs">
            <Zap size={14} />
            Metabolic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="mt-4">
          <ChartContainer config={weightFatConfig} className="h-[200px] w-full">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="weight"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis 
                yAxisId="fat"
                orientation="right"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[10, 25]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine 
                yAxisId="fat" 
                y={15} 
                stroke="hsl(160, 84%, 39%)" 
                strokeDasharray="5 5" 
                label={{ value: '15% Goal', fill: 'hsl(160, 84%, 39%)', fontSize: 10, position: 'right' }}
              />
              <Area
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                stroke="hsl(187, 78%, 55%)"
                fill="hsl(187, 78%, 55%)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Line
                yAxisId="fat"
                type="monotone"
                dataKey="bodyFat"
                stroke="hsl(0, 84%, 60%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(0, 84%, 60%)', strokeWidth: 0, r: 4 }}
              />
            </ComposedChart>
          </ChartContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(187,78%,55%)]" />
              <span className="text-xs text-muted-foreground">Weight (kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(0,84%,60%)]" />
              <span className="text-xs text-muted-foreground">Body Fat (%)</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="muscle" className="mt-4">
          <ChartContainer config={muscleConfig} className="h-[200px] w-full">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="mass"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis 
                yAxisId="percent"
                orientation="right"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[45, 60]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine 
                yAxisId="mass" 
                y={81} 
                stroke="hsl(160, 84%, 39%)" 
                strokeDasharray="5 5" 
                label={{ value: '81kg Goal', fill: 'hsl(160, 84%, 39%)', fontSize: 10, position: 'right' }}
              />
              <Area
                yAxisId="mass"
                type="monotone"
                dataKey="muscleMass"
                stroke="hsl(160, 84%, 39%)"
                fill="hsl(160, 84%, 39%)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Line
                yAxisId="percent"
                type="monotone"
                dataKey="skeletalMuscle"
                stroke="hsl(262, 83%, 58%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(262, 83%, 58%)', strokeWidth: 0, r: 4 }}
              />
            </ComposedChart>
          </ChartContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(160,84%,39%)]" />
              <span className="text-xs text-muted-foreground">Muscle Mass (kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(262,83%,58%)]" />
              <span className="text-xs text-muted-foreground">Skeletal Muscle (%)</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metabolic" className="mt-4">
          <ChartContainer config={metabolicConfig} className="h-[200px] w-full">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="bmr"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 50', 'dataMax + 50']}
              />
              <YAxis 
                yAxisId="visceral"
                orientation="right"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[5, 20]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine 
                yAxisId="visceral" 
                y={10} 
                stroke="hsl(160, 84%, 39%)" 
                strokeDasharray="5 5" 
                label={{ value: 'Healthy', fill: 'hsl(160, 84%, 39%)', fontSize: 10, position: 'right' }}
              />
              <Area
                yAxisId="bmr"
                type="monotone"
                dataKey="bmr"
                stroke="hsl(262, 83%, 58%)"
                fill="hsl(262, 83%, 58%)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Line
                yAxisId="visceral"
                type="monotone"
                dataKey="visceralFat"
                stroke="hsl(25, 95%, 53%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(25, 95%, 53%)', strokeWidth: 0, r: 4 }}
              />
            </ComposedChart>
          </ChartContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(262,83%,58%)]" />
              <span className="text-xs text-muted-foreground">BMR (kcal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(25,95%,53%)]" />
              <span className="text-xs text-muted-foreground">Visceral Fat</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
