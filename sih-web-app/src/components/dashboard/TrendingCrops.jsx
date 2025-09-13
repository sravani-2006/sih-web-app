
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame } from "lucide-react"; // Changed Fire to Flame
import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingCrops({ crops, isLoading }) {
  const trendingCrops = crops
    .filter(crop => crop.trend === 'rising')
    .sort((a, b) => (b.current_price - (b.previous_price || b.current_price)) - (a.current_price - (a.previous_price || a.current_price)))
    .slice(0, 5);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5" /> {/* Changed Fire to Flame */}
          Trending Up
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trendingCrops.map((crop, index) => {
              const priceChange = crop.current_price - (crop.previous_price || crop.current_price);
              const changePercent = crop.previous_price 
                ? ((priceChange / crop.previous_price) * 100).toFixed(1)
                : 0;
              
              return (
                <div key={crop.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{crop.name}</span>
                    {index === 0 && <Badge className="bg-orange-100 text-orange-800 text-xs">Hot</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      +{changePercent}%
                    </span>
                  </div>
                </div>
              );
            })}
            
            {trendingCrops.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No trending crops today
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
