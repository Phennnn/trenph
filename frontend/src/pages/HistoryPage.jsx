import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '@/context/DataContext';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { History as HistoryIcon, Route, Banknote, Timer, Leaf, BarChart3, Star, Clock, MapPin, ArrowRight, Train, Bus, Navigation, Award, TrendingUp } from 'lucide-react';

export default function HistoryPage() {
  const { favoriteRoutes } = useTransitData(); // Keep static favorites for now
  const { token } = useAppContext();

  const [journeyHistory, setJourneyHistory] = useState([]);
  const [analyticsStats, setAnalyticsStats] = useState(null); // State for dynamic stats
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryAndAnalytics = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { 'x-auth-token': token } };
        // Fetch both history and analytics at the same time
        const [historyRes, analyticsRes] = await Promise.all([
          axios.get('/api/trips', config),
          axios.get('/api/analytics', config)
        ]);
        setJourneyHistory(historyRes.data);
        setAnalyticsStats(analyticsRes.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryAndAnalytics();
  }, [token]);

  const getModeIcon = (mode) => {
    if (!mode) return <Train className="w-4 h-4" />;
    if (mode.includes('LRT') || mode.includes('MRT') || mode.includes('PNR')) return <Train className="w-4 h-4" />;
    if (mode.includes('Bus')) return <Bus className="w-4 h-4" />;
    return <Navigation className="w-4 h-4" />;
  };

  const transportUsage = [
      { mode: 'MRT3', usage: 45, color: 'bg-blue-500' },
      { mode: 'LRT2', usage: 30, color: 'bg-purple-500' },
      { mode: 'PNR', usage: 15, color: 'bg-green-500' },
      { mode: 'LRT1', usage: 10, color: 'bg-yellow-500' }
  ];

  if (loading) {
    return <div className="p-4 text-center">Loading Journey History & Analytics...</div>;
  }

  if (!token) {
      return <div className="p-4 text-center">Please log in to view your journey history.</div>
  }
  
  // Use a default stats object if fetching fails or user has no data yet
  const stats = analyticsStats || { totalJourneys: 0, totalCost: 0, totalTime: 0, carbonSaved: 0, favoriteRoute: "N/A", mostUsedStation: "N/A" };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600"><HistoryIcon /> Journey History & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-white/50 border"><Route className="w-6 h-6 text-blue-600 mx-auto mb-2" /><div className="text-2xl font-bold text-blue-600">{stats.totalJourneys}</div><div className="text-sm text-gray-500">Total Trips</div></div>
            <div className="text-center p-4 rounded-lg bg-white/50 border"><Banknote className="w-6 h-6 text-green-600 mx-auto mb-2" /><div className="text-2xl font-bold text-green-600">₱{stats.totalCost.toFixed(0)}</div><div className="text-sm text-gray-500">Total Spent</div></div>
            <div className="text-center p-4 rounded-lg bg-white/50 border"><Timer className="w-6 h-6 text-purple-600 mx-auto mb-2" /><div className="text-2xl font-bold text-purple-600">{Math.floor(stats.totalTime / 60)}h</div><div className="text-sm text-gray-500">Travel Time</div></div>
            <div className="text-center p-4 rounded-lg bg-white/50 border"><Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" /><div className="text-2xl font-bold text-green-600">{stats.carbonSaved.toFixed(1)}kg</div><div className="text-sm text-gray-500">CO₂ Saved</div></div>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-700 mb-3">You've saved {stats.carbonSaved.toFixed(1)}kg of CO₂ this month!</p>
            <Progress value={(stats.carbonSaved / 100) * 100} className="h-2 [&>div]:bg-green-500" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Trips</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader><CardTitle>Recent Journeys</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {journeyHistory.length > 0 ? (
                journeyHistory.map(journey => (
                  <div key={journey.id} className="p-4 rounded-lg border bg-white/50">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            {getModeIcon(journey.mode)}
                            <Badge variant="outline">{journey.mode}</Badge>
                            <span className="text-sm text-gray-500">{new Date(journey.trip_date).toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold">₱{parseFloat(journey.cost).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">{journey.duration} min</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" /><span>{journey.origin}</span>
                        <ArrowRight size={16} className="text-gray-400" />
                        <MapPin size={16} className="text-green-600" /><span>{journey.destination}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">You haven't saved any trips yet. Plan a journey to get started!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
            <Card><CardHeader><CardTitle>Your Travel Analytics</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div><h3 className="font-semibold mb-3">Usage Patterns</h3><div className="grid md:grid-cols-2 gap-4"><div className="p-4 rounded-lg border bg-white/50"><div className="flex items-center gap-2 mb-1"><Star size={16} className="text-yellow-500" /><h4>Favorite Route</h4></div><p>{stats.favoriteRoute}</p></div><div className="p-4 rounded-lg border bg-white/50"><div className="flex items-center gap-2 mb-1"><MapPin size={16} className="text-red-500" /><h4>Most Used Station</h4></div><p>{stats.mostUsedStation}</p></div></div></div>
                    <div><h3 className="font-semibold mb-3">Transport Mode Usage (Sample)</h3><div className="space-y-3">{transportUsage.map(item => (<div key={item.mode} className="flex items-center gap-3"><div className="w-16 text-sm font-medium">{item.mode}</div><div className="flex-1 bg-gray-200 rounded-full h-2"><div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.usage}%` }}></div></div><span className="text-sm">{item.usage}%</span></div>))}</div></div>
                    <div><h3 className="font-semibold mb-3">Achievements</h3><div className="grid grid-cols-3 gap-4"><div className="p-3 text-center border rounded-lg bg-green-50"><Leaf className="mx-auto text-green-600" /><p className="text-sm font-semibold">Eco Warrior</p><p className="text-xs text-gray-500">Saved {stats.carbonSaved.toFixed(1)}kg CO₂</p></div><div className="p-3 text-center border rounded-lg bg-blue-50"><Route className="mx-auto text-blue-600" /><p className="text-sm font-semibold">Explorer</p><p className="text-xs text-gray-500">{stats.totalJourneys} trips</p></div><div className="p-3 text-center border rounded-lg bg-orange-50"><Timer className="mx-auto text-orange-600" /><p className="text-sm font-semibold">Time Saver</p><p className="text-xs text-gray-500">{Math.floor(stats.totalTime/60)}+ hours</p></div></div></div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="favorites">
            <Card><CardHeader><CardTitle>Favorite Routes (Coming Soon)</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {favoriteRoutes.map(fav => (
                        <div key={fav.id} className="p-4 rounded-lg border bg-white/50">
                            <div className="flex justify-between items-center"><div className="flex items-center gap-2"><Star size={16} className="text-yellow-500" /><div><h4 className="font-semibold">{fav.name}</h4><p className="text-sm text-gray-500">{fav.route}</p></div></div><Button size="sm">Book Again</Button></div>
                            <div className="grid grid-cols-3 gap-4 pt-3 mt-3 border-t text-sm text-center"><p><span className="text-xs text-gray-500 block">Frequency</span>{fav.frequency}</p><p><span className="text-xs text-gray-500 block">Avg. Time</span>{fav.avgTime}</p><p><span className="text-xs text-gray-500 block">Avg. Cost</span>{fav.avgCost}</p></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}