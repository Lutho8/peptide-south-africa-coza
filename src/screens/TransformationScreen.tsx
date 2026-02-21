import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, UtensilsCrossed, Camera, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WaterTracker } from '@/components/tracking/WaterTracker';
import { FoodLogger } from '@/components/tracking/FoodLogger';
import { ProgressPhotos } from '@/components/tracking/ProgressPhotos';
import { ActivityCalendar } from '@/components/tracking/ActivityCalendar';

export function TransformationScreen() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transformation</h1>
          <p className="text-sm text-muted-foreground">See your progress at a glance</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="text-xs gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="water" className="text-xs gap-1">
            <Droplets className="w-3.5 h-3.5" />
            Water
          </TabsTrigger>
          <TabsTrigger value="food" className="text-xs gap-1">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Food
          </TabsTrigger>
          <TabsTrigger value="photos" className="text-xs gap-1">
            <Camera className="w-3.5 h-3.5" />
            Photos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <ActivityCalendar />
        </TabsContent>

        <TabsContent value="water" className="mt-4">
          <WaterTracker />
        </TabsContent>

        <TabsContent value="food" className="mt-4">
          <FoodLogger />
        </TabsContent>

        <TabsContent value="photos" className="mt-4">
          <ProgressPhotos />
        </TabsContent>
      </Tabs>
    </div>
  );
}
