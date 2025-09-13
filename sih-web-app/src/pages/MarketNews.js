import React, { useState, useEffect } from "react";
import { MarketNews } from "@/entities/MarketNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Newspaper, TrendingUp, Cloud, FileText, Lightbulb, BarChart3, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function MarketNewsPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const fetchedNews = await MarketNews.list("-created_date");
      setNews(fetchedNews);
    } catch (error) {
      console.error("Error loading news:", error);
    }
    setIsLoading(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'price_update': return <TrendingUp className="w-4 h-4" />;
      case 'weather': return <Cloud className="w-4 h-4" />;
      case 'government_policy': return <FileText className="w-4 h-4" />;
      case 'farming_tips': return <Lightbulb className="w-4 h-4" />;
      case 'market_analysis': return <BarChart3 className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'price_update': return 'bg-green-100 text-green-800 border-green-200';
      case 'weather': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'government_policy': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'farming_tips': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'market_analysis': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNews = activeCategory === "all" 
    ? news 
    : news.filter(item => item.category === activeCategory);

  const categories = [
    { value: "all", label: "All News" },
    { value: "price_update", label: "Price Updates" },
    { value: "weather", label: "Weather" },
    { value: "government_policy", label: "Policies" },
    { value: "farming_tips", label: "Farming Tips" },
    { value: "market_analysis", label: "Market Analysis" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Market News</h1>
          <p className="text-gray-600 text-lg">
            Stay updated with the latest agricultural news, market trends, and farming insights
          </p>
        </div>

        {/* Category Filter */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Browse by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <TabsTrigger key={category.value} value={category.value} className="text-xs">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* News Articles */}
        <div className="space-y-6">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredNews.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Available</h3>
                <p className="text-gray-500">
                  No news articles found for the selected category
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNews.map((article) => (
              <Card key={article.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(article.created_date), "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={`${getCategoryColor(article.category)} border flex items-center gap-1`}>
                        {getCategoryIcon(article.category)}
                        {article.category?.replace(/_/g, ' ')}
                      </Badge>
                      {article.impact && (
                        <Badge className={getImpactColor(article.impact)}>
                          {article.impact} impact
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-gray max-w-none mb-4">
                    <p className="text-gray-700 leading-relaxed">{article.content}</p>
                  </div>

                  {/* Relevant Crops */}
                  {article.relevant_crops && article.relevant_crops.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Affects these crops:</p>
                      <div className="flex flex-wrap gap-2">
                        {article.relevant_crops.map((crop, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stay Updated Note */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-green-900 mb-2">📱 Stay Updated</h3>
            <p className="text-green-800 text-sm">
              Enable price alerts to get notified about market changes that matter to your crops. 
              Check back regularly for the latest agricultural news and government announcements.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}