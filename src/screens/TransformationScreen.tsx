import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Droplets, UtensilsCrossed, Camera, CalendarDays, Ruler, FlaskConical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WaterTracker } from '@/components/tracking/WaterTracker';
import { FoodLogger } from '@/components/tracking/FoodLogger';
import { ProgressPhotos } from '@/components/tracking/ProgressPhotos';
import { ActivityCalendar } from '@/components/tracking/ActivityCalendar';
import { MeasurementTracker } from '@/components/tracking/MeasurementTracker';
import { BloodworkTab } from '@/components/bloodwork/BloodworkTab';
import { useSwipeNav } from '@/hooks/useSwipeNav';

const TABS = ['calendar', 'measure', 'bloodwork', 'water', 'food', 'photos'] as const;
type TabId = typeof TABS[number];

export function TransformationScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('calendar');

  const swipeHandlers = useSwipeNav({
    onSwipeLeft: () => {
      const i = TABS.indexOf(activeTab);
      if (i < TABS.length - 1) setActiveTab(TABS[i + 1]);
    },
    onSwipeRight: () => {
      const i = TABS.indexOf(activeTab);
      if (i > 0) setActiveTab(TABS[i - 1]);
    },
  });

  return (
    <div className="pb-24 space-y-6" {...swipeHandlers}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Trophy size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Results</h1>
          <p className="text-sm text-muted-foreground">Your outcomes, measurements & momentum</p>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
        <TabsList className="grid w-full grid-cols-6 h-auto">
          <TabsTrigger value="calendar" className="text-[10px] gap-0.5 py-2 flex-col sm:flex-row sm:text-xs sm:gap-1">
            <CalendarDays className="w-3.5 h-3.5" />Calendar
          </TabsTrigger>
          <TabsTrigger value="measure" className="text-[10px] gap-0.5 py-2 flex-col sm:flex-row sm:text-xs sm:gap-1">
            <Ruler className="w-3.5 h-3.5" />Measure
          </TabsTrigger>
          <TabsTrigger value="bloodwork" className="text-[10px] gap-0.5 py-2 flex-col sm:flex-row sm:text-xs sm:gap-1">
            <FlaskConical className="w-3.5 h-3.5" />Blood
          </TabsTrigger>
          <TabsTrigger value="water" className="text-[10px] gap-0.5 py-2 flex-col sm:flex-row sm:text-xs sm:gap-1">
            <Droplets className="w-3.5 h-3.5" />Water
          </TabsTrigger>
          <TabsTrigger value="food" className="text-[10px] gap-0.5 py-2 flex-col sm:flex-row sm:text-xs sm:gap-1">
            <UtensilsCrossed className="w-3.5 h-3.5" />Food
          </TabsTrigger>
          <TabsTrigger value="photos" className="text-[10px] gap-0.5 py-2 flex-col sm:flex-row sm:text-xs sm:gap-1">
            <Camera className="w-3.5 h-3.5" />Photos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4"><ActivityCalendar /></TabsContent>
        <TabsContent value="measure" className="mt-4"><MeasurementTracker /></TabsContent>
        <TabsContent value="bloodwork" className="mt-4"><BloodworkTab /></TabsContent>
        <TabsContent value="water" className="mt-4"><WaterTracker /></TabsContent>
        <TabsContent value="food" className="mt-4"><FoodLogger /></TabsContent>
        <TabsContent value="photos" className="mt-4"><ProgressPhotos /></TabsContent>
      </Tabs>
    </div>
  );
}

