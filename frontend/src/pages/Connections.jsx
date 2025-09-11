import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '@/context/DataContext'; // <-- 1. IMPORT THE HOOK
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Route, Bus, Train, Car, Navigation, ArrowRight, Timer, Clock, DollarSign } from 'lucide-react';

export default function Connections() {
  // 2. GET CONNECTIONS DATA FROM THE CONTEXT
  const { connections } = useTransitData();

  const [selectedType, setSelectedType] = useState('all');
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // 3. UPDATE FILTER LOGIC TO HANDLE DATA LOADING
  useEffect(() => {
    if (connections) {
        if (selectedType === 'all') {
            setFilteredConnections(connections);
        } else {
            setFilteredConnections(connections.filter(conn => conn.type === selectedType));
        }
    }
  }, [selectedType, connections]);

  const getTransportIcon = (type) => {
    switch (type) {
      case 'lrt': case 'mrt': return <Train className="w-5 h-5" />;
      case 'bus': return <Bus className="w-5 h-5" />;
      case 'jeepney': return <Car className="w-5 h-5" />;
      default: return <Route className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type) => {
    if (type === 'lrt' || type === 'mrt') return type.toUpperCase();
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const transportTypes = ['all', 'lrt', 'mrt', 'bus', 'jeepney'];
  
  // 4. ADD A LOADING STATE
  if (!connections) {
      return <div className="p-4 text-center">Loading Connections...</div>
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-purple-600">
              <Route className="w-6 h-6" />
              <span>Transport Connections</span>
            </div>
            <Badge variant="outline">{currentTime.toLocaleTimeString()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {transportTypes.map((type) => (
              <Button key={type} variant={selectedType === type ? "default" : "outline"} size="sm" onClick={() => setSelectedType(type)}>
                {getTypeLabel(type)}
              </Button>
            ))}
          </div>
          <div className="space-y-4">
            {filteredConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 border rounded-lg bg-white/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg text-white" style={{ backgroundColor: connection.color || '#6b7280' }}>
                      {getTransportIcon(connection.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{connection.name}</h4>
                      <p className="text-sm text-gray-600">To: {connection.destination}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{connection.status}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2"><Navigation size={14} className="text-blue-500" /> Walk: {connection.walkingTime}m</div>
                  <div className="flex items-center gap-2"><Clock size={14} className="text-green-500" /> Freq: {connection.frequency}</div>
                  <div className="flex items-center gap-2"><Timer size={14} className="text-orange-500" /> Hours: {connection.operatingHours}</div>
                  <div className="flex items-center gap-2"><DollarSign size={14} className="text-purple-500" /> Fare: ₱{connection.fare}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}