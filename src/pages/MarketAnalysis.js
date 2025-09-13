import React, { useState, useEffect } from "react";
import { Crop } from "@/entities/Crop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3, Calendar, IndianRupee } from "lucide-react";

export default function MarketAnalysis() {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    setIsLoading(true);
    try {
      const fetchedCrops = await Crop.list("-current_price");
      setCrops(fetchedCrops);
    } catch (error) {
      console.error("Error loading crops:", error);
    }
    setIsLoading(false);
  };

  // Generate mock historical data for demonstration
  const generateHistoricalData = (crop) => {
    const data = [];
    const basePrice = crop.current_price;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price fluctuation
      const variation = (Math.random() - 0.5) * 0.1; // 10% variation
      const price = Math.round(basePrice * (1 + variation));
      
      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: price,
        crop: crop.name
      });
    }
    return data;
  };

  const getFilteredData = () => {
    if (selectedCrop === "all") {
      // Return average price data for all crops
      const allData = crops.map(crop => generateHistoricalData(crop));
      if (allData.length === 0) return [];
      
      return allData[0].map((_, index) => {
        const avgPrice = allData.reduce((sum, cropData) => sum + cropData[index].price, 0) / allData.length;
        return {
          ...allData[0][index],
          price: Math.round(avgPrice),
          crop: "Average"
        };
      });
    } else {
      const crop = crops.find(c => c.name === selectedCrop);
      return crop ? generateHistoricalData(crop) : [];
    }
  };

  const getCropComparison = () => {
    return crops.slice(0, 8).map(crop => ({
      name: crop.name,
      price: crop.current_price,
      trend: crop.trend,
      demand: crop.demand
    }));
  };

  const chartData = getFilteredData();
  const comparisonData = getCropComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Market Analysis</h1>
          <p className="text-gray-600 text-lg">
            Detailed price trends and market insights for informed decision making
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analysis Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Select Crop:</span>
              </div>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops (Average)</SelectItem>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.name}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Price Trend Chart */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                30-Day Price Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Price/Quintal']}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#16a34a' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-500">
                  No data available for selected crop
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Comparison Chart */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Current Price Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {comparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11 }}
                      stroke="#666"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Price/Quintal']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="price" 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-500">
                  Loading price comparison data...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle>Market Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Best Performing Crops</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  {crops.filter(crop => crop.trend === 'rising').slice(0, 3).map(crop => (
                    <li key={crop.id} className="flex justify-between">
                      <span>{crop.name}</span>
                      <span className="font-medium">₹{crop.current_price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">High Demand Crops</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {crops.filter(crop => crop.demand === 'high').slice(0, 3).map(crop => (
                    <li key={crop.id} className="flex justify-between">
                      <span>{crop.name}</span>
                      <span className="font-medium">₹{crop.current_price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">Selling Tips</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Early morning sales get better prices</li>
                  <li>• Quality grading impacts final price</li>
                  <li>• Monitor weather for price fluctuations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}