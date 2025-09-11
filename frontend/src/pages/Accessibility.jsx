import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransitData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCheck, User, Eye, Ear, Phone, Navigation, CheckCircle, AlertTriangle, 
  HelpingHand, Activity, Volume2
} from 'lucide-react';

export default function Accessibility() {
  const { accessibilityFeatures, accessibilityRoutes, assistanceServices } = useTransitData();

  if (!accessibilityFeatures || !accessibilityRoutes || !assistanceServices) {
    return <div className="p-4 text-center">Loading Accessibility Data...</div>;
  }
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'physical': return <User className="w-5 h-5 text-blue-500" />;
      case 'visual': return <Eye className="w-5 h-5 text-purple-500" />;
      case 'hearing': return <Ear className="w-5 h-5 text-green-500" />;
      default: return <UserCheck className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-600">
                <Activity />
                <span>Accessibility Services</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">PWD Friendly Station</Badge>
                <Button size="sm"><HelpingHand className="w-4 h-4 mr-2" />Request Help</Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      <Tabs defaultValue="features">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="assistance">Assistance</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <Card>
            <CardHeader><CardTitle>Available Accessibility Features</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {accessibilityFeatures.map(feature => (
                <div key={feature.id} className="p-4 border rounded-lg bg-white/50 flex items-start gap-4">
                  {getTypeIcon(feature.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{feature.name}</h4>
                      <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">AVAILABLE</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{feature.location}</p>
                    <p className="text-sm text-gray-700 mt-2">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
          <Card>
            <CardHeader><CardTitle>Accessible Navigation Routes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {accessibilityRoutes.map(route => (
                <div key={route.id} className="p-4 border rounded-lg bg-white/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{route.name}</h4>
                      <p className="text-sm text-gray-600">{route.from} → {route.to}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{route.difficulty.toUpperCase()}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {route.features.map((feature, i) => (
                      <Badge key={i} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistance">
          <Card>
            <CardHeader><CardTitle>Personal Assistance Services</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Available Services</h3>
                {assistanceServices.map(service => (
                  <div key={service.id} className="p-3 border rounded-lg bg-white/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{service.service}</h4>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                      <Button variant="outline" size="sm"><Phone size={14} className="mr-2" /> Call</Button>
                    </div>
                    <p className="text-sm font-mono text-indigo-600 mt-1">{service.contact}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-lg bg-gray-100 flex flex-col justify-center">
                <h3 className="font-semibold">Quick Request Form</h3>
                <p className="text-sm text-gray-600 my-2">Need immediate assistance? Use the emergency call button or contact our customer service team.</p>
                <div className="space-y-2 mt-auto">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white"><AlertTriangle size={16} className="mr-2" /> Emergency Assistance</Button>
                  <Button variant="outline" className="w-full"><Phone size={16} className="mr-2" /> Call Customer Service</Button>
                  <Button variant="outline" className="w-full"><HelpingHand size={16} className="mr-2" /> Request General Help</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardHeader><CardTitle>Emergency Procedures for PWD</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Evacuation Procedures</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5" /> Wheelchair users should wait for assistance near elevators.</li>
                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5" /> Visually impaired passengers should ask for guide assistance.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-600 mb-2">Communication During Emergency</h3>
                   <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><Volume2 size={16} className="text-blue-500 mt-0.5" /> Audio announcements with clear instructions.</li>
                    <li className="flex gap-2"><Eye size={16} className="text-purple-500 mt-0.5" /> Visual displays showing evacuation routes.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-600 mb-2">Emergency Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-medium">Station Emergency</div>
                    <div className="font-mono text-red-700 font-bold">(02) 8319-0055</div>
                  </div>
                  <div>
                    <div className="font-medium">National Emergency</div>
                    <div className="font-mono text-red-700 font-bold">911</div>
                  </div>
                   <div>
                    <div className="font-medium">Medical (Red Cross)</div>
                    <div className="font-mono text-red-700 font-bold">143</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}