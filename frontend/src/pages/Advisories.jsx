import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Wrench, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axios from 'axios'; // Import axios

const getIconForType = (type) => {
    switch(type) {
        case 'maintenance': return <Wrench className="w-5 h-5 text-blue-500" />;
        case 'disruption': return <Megaphone className="w-5 h-5 text-red-500" />;
        default: return <Info className="w-5 h-5 text-green-500" />;
    }
};

export default function Advisories() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        const response = await axios.get('/api/advisories');
        setAdvisories(response.data);
      } catch (error) {
        console.error("Failed to fetch advisories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisories();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading Advisories...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Megaphone />
                    Service Advisories & Announcements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {advisories.length > 0 ? (
                    advisories.map((advisory, index) => (
                        <motion.div
                            key={advisory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-4 border rounded-lg bg-white/50"
                        >
                            <div className="flex items-start gap-4">
                                <div>{getIconForType(advisory.type)}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-lg">{advisory.title}</h3>
                                        <Badge variant="outline">{advisory.line}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Posted on: {new Date(advisory.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-700">{advisory.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No active advisories at the moment.</p>
                )}
            </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}