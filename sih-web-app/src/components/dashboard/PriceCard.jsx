import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export default function PriceCard({ crop, getTrendIcon, getTrendColor }) {
  const priceChange = crop.current_price - (crop.previous_price || crop.current_price);
  const changePercent = crop.previous_price 
    ? ((priceChange / crop.previous_price) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-4 border rounded-xl hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{crop.name}</h3>
          {crop.variety && (
            <p className="text-sm text-gray-500">{crop.variety}</p>
          )}
        </div>
        <Badge className={`${getTrendColor(crop.trend)} border flex items-center gap-1`}>
          {getTrendIcon(crop.trend)}
          {crop.trend || 'stable'}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">₹{crop.current_price}</span>
          <span className="text-sm text-gray-500">/quintal</span>
        </div>
        
        {crop.previous_price && (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              priceChange > 0 ? 'text-green-600' : priceChange < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {priceChange > 0 ? '+' : ''}₹{Math.abs(priceChange)} ({changePercent > 0 ? '+' : ''}{changePercent}%)
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
          {crop.mandi_location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {crop.mandi_location}
            </div>
          )}
          {crop.demand && (
            <Badge variant="outline" className="text-xs">
              {crop.demand} demand
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}