import React, { useState, useEffect } from "react";
import { PriceAlert, Crop } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [crops, setCrops] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    crop_name: "",
    target_price: "",
    alert_type: "above"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, fetchedCrops, fetchedAlerts] = await Promise.all([
        User.me(),
        Crop.list("name"),
        PriceAlert.list("-created_date")
      ]);
      
      setUser(userData);
      setCrops(fetchedCrops);
      setAlerts(fetchedAlerts.filter(alert => alert.farmer_email === userData.email));
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await PriceAlert.create({
        ...newAlert,
        target_price: parseFloat(newAlert.target_price),
        farmer_email: user.email
      });
      
      setNewAlert({ crop_name: "", target_price: "", alert_type: "above" });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await PriceAlert.delete(alertId);
      loadData();
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const getCurrentPrice = (cropName) => {
    const crop = crops.find(c => c.name === cropName);
    return crop ? crop.current_price : null;
  };

  const isAlertTriggered = (alert) => {
    const currentPrice = getCurrentPrice(alert.crop_name);
    if (!currentPrice) return false;
    
    if (alert.alert_type === "above") {
      return currentPrice >= alert.target_price;
    } else {
      return currentPrice <= alert.target_price;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Price Alerts</h1>
          <p className="text-gray-600 text-lg">
            Set up notifications to get informed when crop prices reach your target
          </p>
        </div>

        {/* Create Alert Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Alert
          </Button>
        </div>

        {/* Alert Form */}
        {showForm && (
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Create Price Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="crop">Select Crop</Label>
                    <Select
                      value={newAlert.crop_name}
                      onValueChange={(value) => setNewAlert({...newAlert, crop_name: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.map((crop) => (
                          <SelectItem key={crop.id} value={crop.name}>
                            {crop.name} (Current: ₹{crop.current_price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Target Price (₹/quintal)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter target price"
                      value={newAlert.target_price}
                      onChange={(e) => setNewAlert({...newAlert, target_price: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Alert Type</Label>
                    <Select
                      value={newAlert.alert_type}
                      onValueChange={(value) => setNewAlert({...newAlert, alert_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">When price goes above</SelectItem>
                        <SelectItem value="below">When price goes below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Create Alert
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Alerts List */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Your Price Alerts ({alerts.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Price Alerts</h3>
                <p className="text-gray-500 mb-4">
                  Create your first price alert to get notified when crops reach your target price
                </p>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  Create Alert
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => {
                  const currentPrice = getCurrentPrice(alert.crop_name);
                  const triggered = isAlertTriggered(alert);
                  
                  return (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      triggered ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{alert.crop_name}</h3>
                            {triggered && (
                              <Badge className="bg-green-100 text-green-800">
                                Alert Triggered!
                              </Badge>
                            )}
                            {!alert.is_active && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              {alert.alert_type === 'above' ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span>
                                Alert when price goes {alert.alert_type} ₹{alert.target_price}
                              </span>
                            </div>
                            
                            {currentPrice && (
                              <div>
                                Current: ₹{currentPrice}/quintal
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information */}
        {alerts.length > 0 && (
          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              You will receive email notifications when your price alerts are triggered. 
              Prices are updated every 15 minutes during market hours.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}