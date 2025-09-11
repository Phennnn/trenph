import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransitData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Phone, Navigation, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Clock, Users, UserCheck, MapPin
} from 'lucide-react';

export default function Emergency() {
  const { stations, emergencyContacts, evacuationRoutes } = useTransitData();
  const [selectedLine, setSelectedLine] = useState('PNR');
  const [selectedStation, setSelectedStation] = useState('Tutuban');

  const routesForStation = evacuationRoutes[selectedLine]?.[selectedStation] || [];

  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'north': return <ArrowUp className="w-5 h-5 text-gray-500" />;
      case 'south': return <ArrowDown className="w-5 h-5 text-gray-500" />;
      case 'east': return <ArrowRight className="w-5 h-5 text-gray-500" />;
      case 'west': return <ArrowLeft className="w-5 h-5 text-gray-500" />;
      default: return <Navigation className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'clear': return 'text-green-600';
      case 'congested': return 'text-yellow-600';
      case 'blocked': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-red-600" /> Emergency & Safety Systems
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="evacuation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="evacuation">Evacuation Routes</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="evacuation">
          <Card>
            <CardHeader>
              <CardTitle>Select Your Station</CardTitle>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <select 
                  value={selectedLine} 
                  onChange={(e) => {
                    setSelectedLine(e.target.value);
                    setSelectedStation(stations[e.target.value].stations[0]);
                  }} 
                  className="p-2 border rounded-md"
                >
                  {Object.keys(stations).map(line => (
                    <option key={line} value={line}>{stations[line].name}</option>
                  ))}
                </select>
                <select 
                  value={selectedStation} 
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  {stations[selectedLine].stations.map(station => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-lg">Routes for {selectedStation}</h3>
              {routesForStation.length > 0 ? (
                routesForStation.map(route => (
                  <div key={route.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3 font-semibold">
                        {getDirectionIcon(route.direction)}
                        <span>{route.from} → {route.to}</span>
                      </div>
                      <span className={`font-bold text-sm ${getStatusColor(route.status)}`}>
                        {route.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2"><Clock size={14}/> {route.estimatedTime} min</div>
                      <div className="flex items-center gap-2"><Users size={14}/> {route.capacity} capacity</div>
                      <div className="flex items-center gap-2"><UserCheck size={14}/> {route.accessibility ? 'PWD Access' : 'No PWD Access'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No evacuation routes available for this station.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
            <Card>
                <CardHeader><CardTitle>Emergency Contacts</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    {emergencyContacts.map(c => (
                        <div key={c.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{c.name}</h4>
                                    <p className="text-sm text-gray-500">{c.description}</p>
                                </div>
                                <Badge variant={c.available ? 'default' : 'destructive'} className="bg-green-100 text-green-800">Available</Badge>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-mono text-red-600 font-bold">{c.number}</p>
                                <Button size="sm" variant="outline"><Phone size={14} className="mr-2" /> Call</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}