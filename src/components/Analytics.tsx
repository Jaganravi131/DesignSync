import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const timeRanges = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '1y', label: 'Last year' }
];

const mockAnalytics = {
  overview: {
    totalVisitors: { value: 12847, change: 12.5, trend: 'up' },
    pageViews: { value: 28394, change: 8.2, trend: 'up' },
    bounceRate: { value: 34.2, change: -5.1, trend: 'down' },
    avgSessionDuration: { value: '2m 34s', change: 15.3, trend: 'up' }
  },
  topPages: [
    { path: '/', title: 'Homepage', views: 8234, change: 12.3 },
    { path: '/products', title: 'Products', views: 5621, change: -3.2 },
    { path: '/about', title: 'About Us', views: 4892, change: 18.7 },
    { path: '/contact', title: 'Contact', views: 3456, change: 7.1 },
    { path: '/pricing', title: 'Pricing', views: 2891, change: 22.4 }
  ],
  trafficSources: [
    { source: 'Organic Search', visitors: 5234, percentage: 40.7 },
    { source: 'Direct', visitors: 3821, percentage: 29.8 },
    { source: 'Social Media', visitors: 2156, percentage: 16.8 },
    { source: 'Referral', visitors: 1087, percentage: 8.5 },
    { source: 'Email', visitors: 549, percentage: 4.3 }
  ],
  deviceTypes: [
    { device: 'Desktop', users: 7821, percentage: 60.9 },
    { device: 'Mobile', users: 4234, percentage: 33.0 },
    { device: 'Tablet', users: 792, percentage: 6.2 }
  ]
};

export function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your application's performance and user behavior</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
            
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockAnalytics.overview.totalVisitors.value.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{mockAnalytics.overview.totalVisitors.change}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockAnalytics.overview.pageViews.value.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{mockAnalytics.overview.pageViews.change}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockAnalytics.overview.bounceRate.value}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                {mockAnalytics.overview.bounceRate.change}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockAnalytics.overview.avgSessionDuration.value}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">
                +{mockAnalytics.overview.avgSessionDuration.change}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Visitors Over Time</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Chart visualization would appear here</p>
                <p className="text-xs text-gray-400">Showing upward trend in visitors</p>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
            
            <div className="space-y-4">
              {mockAnalytics.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                      <span className="text-sm text-gray-600">{source.visitors.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-4 min-w-[3rem] text-right">
                    {source.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {mockAnalytics.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{page.title}</p>
                      <p className="text-sm text-gray-600">{page.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{page.views.toLocaleString()}</p>
                      <div className="flex items-center">
                        {page.change > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${page.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {page.change > 0 ? '+' : ''}{page.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Device Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Device Types</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {mockAnalytics.deviceTypes.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-600' : 
                        index === 1 ? 'bg-purple-600' : 'bg-green-600'
                      }`}></div>
                      <span className="font-medium text-gray-900">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{device.users.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{device.percentage}%</p>
                    </div>
                  </div>
                ))}
                
                {/* Visual representation */}
                <div className="mt-6">
                  <div className="flex rounded-lg overflow-hidden h-4">
                    {mockAnalytics.deviceTypes.map((device, index) => (
                      <div
                        key={index}
                        className={`${
                          index === 0 ? 'bg-blue-600' : 
                          index === 1 ? 'bg-purple-600' : 'bg-green-600'
                        } transition-all duration-300`}
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}