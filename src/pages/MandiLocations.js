import React, { useState, useEffect } from "react";
import { Mandi } from "@/entities/Mandi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Calendar, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MandiLocations() {
  const [mandis, setMandis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMandis();
  }, []);

  const loadMandis = async () => {
    setIsLoading(true);
    try {
      const fetchedMandis = await Mandi.list("name");
      setMandis(fetchedMandis);
    } catch (error) {
      console.error("Error loading mandis:", error);
    }
    setIsLoading(false);
  };

  const filteredMandis = mandis.filter(mandi =>
    mandi.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mandi.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mandi.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDirections = (mandiName) => {
    const query = encodeURIComponent(`${mandiName} mandi Punjab`);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mandi Locations</h1>
          <p className="text-gray-600 text-lg">
            Find the nearest mandi and get contact information for all major markets in Punjab
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Mandi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by mandi name, location, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mandi Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredMandis.map((mandi) => (
              <Card key={mandi.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{mandi.name}</h3>
                      <div className="flex items-center gap-1 mt-1 opacity-90">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{mandi.location}, {mandi.district}</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  {/* Contact Information */}
                  {mandi.contact_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{mandi.contact_number}</span>
                    </div>
                  )}

                  {/* Market Days */}
                  {mandi.market_days && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{mandi.market_days}</span>
                    </div>
                  )}

                  {/* Specializations */}
                  {mandi.specialization && mandi.specialization.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Main Crops:</p>
                      <div className="flex flex-wrap gap-1">
                        {mandi.specialization.slice(0, 3).map((crop, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                            {crop}
                          </Badge>
                        ))}
                        {mandi.specialization.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{mandi.specialization.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Facilities */}
                  {mandi.facilities && mandi.facilities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {mandi.facilities.slice(0, 2).map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {mandi.facilities.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{mandi.facilities.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2">
                    <Button
                      onClick={() => getDirections(mandi.name)}
                      className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* No Results */}
        {!isLoading && filteredMandis.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Mandis Found</h3>
              <p className="text-gray-500">
                Try searching with a different location or district name
              </p>
            </CardContent>
          </Card>
        )}

        {/* Information Note */}
        <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-amber-900 mb-2">📞 Need Help?</h3>
            <p className="text-amber-800 text-sm">
              Contact your local agricultural extension officer for the most up-to-date mandi information 
              and current market conditions. Always verify market timings before traveling.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}