'use client';

import { useEffect, useState } from 'react';
import { SystemData } from '../types/system';

export default function SystemMonitor() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/system');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError('Failed to load system information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 500);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading system information...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024 / 1024).toFixed(2);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-700 min-h-screen flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-8">System Monitor</h1>

      {/*resumen*/}
      <div className="bg-gray-600 rounded-lg shadow-md p-6">
        <div className="mt-4">
          <p className="text-lg font-medium">CPU {data.cpu.load}%</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${data.cpu.load}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-lg font-medium">RAM {data.memory.percentage}%</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${data.memory.percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-4">
        {(() => {
            // Encuentra la primera GPU que tenga datos de utilización
            const activeGpu = data.gpu?.controllers?.find(
            gpu => gpu.utilizationGpu !== null && gpu.utilizationGpu !== undefined
            );
            
            if (activeGpu) {
            return (
                <>
                <p className="text-lg font-medium">GPU {activeGpu.utilizationGpu}%</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                    className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${activeGpu.utilizationGpu}%` }}
                    ></div>
                </div>
                </>
            );
            } else {
            return <p className="text-lg font-medium text-gray-400">GPU N/A</p>;
            }
        })()}
        </div>
      </div>
    </div>
  );
}