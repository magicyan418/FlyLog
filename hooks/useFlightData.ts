import { useState, useCallback, useEffect } from 'react';
import { FlightRecord, FlightMood, AIInsight, AISettings } from '../types';
import { getFlightInsights } from '../services/aiService';
import { useLocalStorage } from './useLocalStorage';

export function useFlightData() {
  const [records, setRecords] = useLocalStorage<FlightRecord[]>('captains_flight_log', []);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const addFlight = useCallback((flight: { flightDateTime?: string; duration: number; mood: FlightMood; notes: string; process?: string; intensity: number }) => {
    // 如果提供了 flightDateTime，使用它；否则使用当前时间
    const timestamp = flight.flightDateTime ? new Date(flight.flightDateTime).getTime() : Date.now();
    
    const newFlight: FlightRecord = {
      id: crypto.randomUUID(),
      timestamp,
      duration: flight.duration,
      mood: flight.mood,
      notes: flight.notes,
      process: flight.process,
      intensity: flight.intensity,
    };
    setRecords([newFlight, ...records]);
  }, [records, setRecords]);

  const updateFlight = useCallback((id: string, flight: { flightDateTime?: string; duration: number; mood: FlightMood; notes: string; process?: string; intensity: number }) => {
    const updated = records.map(r => {
      if (r.id === id) {
        // 如果提供了新的 flightDateTime，更新 timestamp
        const timestamp = flight.flightDateTime ? new Date(flight.flightDateTime).getTime() : r.timestamp;
        return {
          ...r,
          timestamp,
          duration: flight.duration,
          mood: flight.mood,
          notes: flight.notes,
          process: flight.process,
          intensity: flight.intensity,
        };
      }
      return r;
    });
    setRecords(updated);
  }, [records, setRecords]);

  const deleteRecord = useCallback((id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    if (updated.length === 0) {
      localStorage.removeItem('captains_flight_log');
    }
  }, [records, setRecords]);

  const fetchInsights = useCallback(async (aiSettings: AISettings) => {
    if (records.length >= 3) {
      setIsAiLoading(true);
      try {
        const insight = await getFlightInsights(records, aiSettings);
        if (insight) setAiInsight(insight);
      } catch (e) {
        console.error(e);
      } finally {
        setIsAiLoading(false);
      }
    }
  }, [records]);

  const clearAllRecords = useCallback(() => {
    setRecords([]);
    setAiInsight(null);
    localStorage.removeItem('captains_flight_log');
  }, [setRecords]);

  const importRecords = useCallback((newRecords: FlightRecord[]) => {
    setRecords(newRecords);
  }, [setRecords]);

  return {
    records,
    aiInsight,
    isAiLoading,
    addFlight,
    updateFlight,
    deleteRecord,
    fetchInsights,
    clearAllRecords,
    importRecords
  };
}