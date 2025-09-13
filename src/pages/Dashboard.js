import React, { useState, useEffect } from "react";
import { Crop } from "@/entities/Crop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, IndianRupee, BarChart3, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import PriceCard from "../components/dashboard/PriceCard";
import TrendingCrops from "../components/dashboard/TrendingCrops";
import MarketSummary from "../components/dashboard/MarketSummary";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    setIsLoading(true);
    try {
      const fetchedCrops = await Crop.list("-current_price", 12);
      setCrops(fetchedCrops);
    } catch (error) {
      console.error("Error loading crops:", error);
    }
    setIsLoading(false);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'rising': return 'text-green-600 bg-green-50 border-green-200';
      case 'falling': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const calculateStats = () => {
    const totalCrops = crops.length;
    const risingCrops = crops.filter(crop => crop.trend === 'rising').length;
    const avgPrice = crops.length > 0 
      ? crops.reduce((sum, crop) => sum + (crop.current_price || 0), 0) / crops.length 
      : 0;

    return { totalCrops, risingCrops, avgPrice };
  };

  const { totalCrops, risingCrops, avgPrice } = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome to Punjab Mandi
            </h1>
            <p className="text-gray-600 text-lg">
              Real-time crop prices and market insights for Punjab farmers
            </p>
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="bg-green-100 text-green-800 px-4 py-1">
                <Clock className="w-4 h-4 mr-2" />
                Updated every 15 minutes
              </Badge>
            </div>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Crops Tracked</CardTitle>
              <BarChart3 className="h-4 w-4 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCrops}</div>
              <p className="text-xs opacity-80 mt-1">Active market listings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Rising Prices</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{risingCrops}</div>
              <p className="text-xs opacity-80 mt-1">Crops with upward trend</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Average Price</CardTitle>
              <IndianRupee className="h-4 w-4 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{avgPrice.toFixed(0)}</div>
              <p className="text-xs opacity-80 mt-1">Per quintal across all crops</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Crop Prices */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <IndianRupee className="w-5 h-5" />
                  Today's Crop Prices
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crops.map((crop) => (
                      <PriceCard 
                        key={crop.id} 
                        crop={crop} 
                        getTrendIcon={getTrendIcon}
                        getTrendColor={getTrendColor}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <TrendingCrops crops={crops} isLoading={isLoading} />
            <MarketSummary crops={crops} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}