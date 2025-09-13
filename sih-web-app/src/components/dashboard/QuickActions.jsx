import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MapPin, TrendingUp, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions() {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Link to={createPageUrl("PriceAlerts")} className="block">
          <Button variant="outline" className="w-full justify-start gap-2 hover:bg-blue-50">
            <Bell className="w-4 h-4" />
            Set Price Alert
          </Button>
        </Link>
        
        <Link to={createPageUrl("MandiLocations")} className="block">
          <Button variant="outline" className="w-full justify-start gap-2 hover:bg-green-50">
            <MapPin className="w-4 h-4" />
            Find Nearest Mandi
          </Button>
        </Link>
        
        <Link to={createPageUrl("MarketAnalysis")} className="block">
          <Button variant="outline" className="w-full justify-start gap-2 hover:bg-purple-50">
            <TrendingUp className="w-4 h-4" />
            View Market Trends
          </Button>
        </Link>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800 font-medium">💡 Pro Tip</p>
          <p className="text-sm text-amber-700 mt-1">
            Check prices before 8 AM for the most accurate rates
          </p>
        </div>
      </CardContent>
    </Card>
  );
}