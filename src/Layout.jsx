import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BarChart3, MapPin, Bell, Newspaper, User, Home, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
    description: "Price overview"
  },
  {
    title: "Market Analysis",
    url: createPageUrl("MarketAnalysis"),
    icon: TrendingUp,
    description: "Trends & charts"
  },
  {
    title: "Mandi Locations",
    url: createPageUrl("MandiLocations"),
    icon: MapPin,
    description: "Find markets"
  },
  {
    title: "Price Alerts",
    url: createPageUrl("PriceAlerts"),
    icon: Bell,
    description: "Set notifications"
  },
  {
    title: "Market News",
    url: createPageUrl("MarketNews"),
    icon: Newspaper,
    description: "Latest updates"
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 to-amber-50">
        <Sidebar className="border-r border-green-200">
          <SidebarHeader className="border-b border-green-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-green-900 text-lg">Punjab Mandi</h2>
                <p className="text-xs text-green-600">ਕਿਸਾਨ ਸਾਥੀ • Farmer's Companion</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-green-700 uppercase tracking-wider px-2 py-2">
                Market Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-green-100 hover:text-green-800 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-green-100 text-green-800 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <div>
                            <span className="font-medium">{item.title}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-green-700 uppercase tracking-wider px-2 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Today's Best Price</span>
                    </div>
                    <p className="text-lg font-bold text-green-900 mt-1">₹2,400/quintal</p>
                    <p className="text-xs text-green-600">Wheat - Amritsar</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-100 to-orange-200 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-800">Market Status</span>
                    </div>
                    <p className="text-lg font-bold text-amber-900 mt-1">Strong Demand</p>
                    <p className="text-xs text-amber-600">Rice varieties</p>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-green-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-900 text-sm truncate">Farmer Account</p>
                <p className="text-xs text-green-600 truncate">Track your crops & earnings</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-green-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-green-900">Punjab Mandi</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}