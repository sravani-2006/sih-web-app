import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar } from "lucide-react";

export default function MarketSummary({ crops }) {
  const marketConditions = () => {
    const risingCount = crops.filter(crop => crop.trend === 'rising').length;
    const fallingCount = crops.filter(crop => crop.trend === 'falling').length;
    const stableCount = crops.filter(crop => crop.trend === 'stable' || !crop.trend).length;
    
    const total = crops.length;
    if (risingCount / total > 0.6) return { status: 'Bullish', color: 'bg-green-100 text-green-800' };
    if (fallingCount / total > 0.6) return { status: 'Bearish', color: 'bg-red-100 text-red-800' };
    return { status: 'Mixed', color: 'bg-yellow-100 text-yellow-800' };
  };

  const { status, color } = marketConditions();

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Market Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Market Sentiment</span>
          <Badge className={color}>{status}</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rising Prices</span>
            <span className="font-medium text-green-600">
              {crops.filter(crop => crop.trend === 'rising').length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Falling Prices</span>
            <span className="font-medium text-red-600">
              {crops.filter(crop => crop.trend === 'falling').length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stable Prices</span>
            <span className="font-medium text-gray-600">
              {crops.filter(crop => crop.trend === 'stable' || !crop.trend).length}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Best Selling Time</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Early morning (6-9 AM) typically offers better prices
          </p>
        </div>
      </CardContent>
    </Card>
  );
}