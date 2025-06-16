import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  ExternalLink,
  Zap,
  CreditCard,
  Mail,
  BarChart3,
  Share2,
  Cloud
} from 'lucide-react';

const integrationCategories = [
  { id: 'all', label: 'All Integrations', count: 24 },
  { id: 'payment', label: 'Payments', count: 6 },
  { id: 'email', label: 'Email & Marketing', count: 8 },
  { id: 'analytics', label: 'Analytics', count: 4 },
  { id: 'social', label: 'Social Media', count: 3 },
  { id: 'storage', label: 'Storage & Files', count: 3 }
];

const mockIntegrations = [
  {
    id: '1',
    name: 'Stripe',
    description: 'Accept online payments with credit cards, PayPal, and more',
    type: 'payment',
    provider: 'Stripe',
    status: 'connected',
    icon: CreditCard,
    color: 'blue',
    features: ['Credit Cards', 'Subscriptions', 'Webhooks', 'Disputes'],
    setupComplexity: 'Easy'
  },
  {
    id: '2',
    name: 'Mailgun',
    description: 'Send transactional and marketing emails at scale',
    type: 'email',
    provider: 'Mailgun',
    status: 'connected',
    icon: Mail,
    color: 'red',
    features: ['Transactional Email', 'Email Validation', 'Analytics', 'Templates'],
    setupComplexity: 'Medium'
  },
  {
    id: '3',
    name: 'Google Analytics',
    description: 'Track website traffic and user behavior',
    type: 'analytics',
    provider: 'Google',
    status: 'disconnected',
    icon: BarChart3,
    color: 'yellow',
    features: ['Traffic Analysis', 'Conversion Tracking', 'Real-time Data', 'Custom Reports'],
    setupComplexity: 'Easy'
  },
  {
    id: '4',
    name: 'Zapier',
    description: 'Connect your app with 5000+ other applications',
    type: 'api',
    provider: 'Zapier',
    status: 'error',
    icon: Zap,
    color: 'orange',
    features: ['5000+ Apps', 'Webhooks', 'Custom Fields', 'Multi-step Workflows'],
    setupComplexity: 'Advanced'
  },
  {
    id: '5',
    name: 'Twitter API',
    description: 'Post updates and manage social media presence',
    type: 'social',
    provider: 'Twitter',
    status: 'disconnected',
    icon: Share2,
    color: 'blue',
    features: ['Auto-posting', 'Social Login', 'Profile Management', 'Analytics'],
    setupComplexity: 'Medium'
  },
  {
    id: '6',
    name: 'AWS S3',
    description: 'Store and serve files with Amazon Web Services',
    type: 'storage',
    provider: 'Amazon',
    status: 'connected',
    icon: Cloud,
    color: 'gray',
    features: ['File Storage', 'CDN', 'Image Processing', 'Backup'],
    setupComplexity: 'Advanced'
  }
];

export function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.type === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedIntegrationData = mockIntegrations.find(int => int.id === selectedIntegration);

  return (
    <div className="flex-1 flex h-full bg-gray-50">
      {/* Categories Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
          <p className="text-sm text-gray-600 mt-1">Connect external services</p>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-2">
            {integrationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm font-medium">{category.label}</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {integrationCategories.find(cat => cat.id === selectedCategory)?.label || 'All Integrations'}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredIntegrations.length} integrations available
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedIntegration(integration.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${integration.color}-100`}>
                        <Icon className={`w-6 h-6 text-${integration.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.provider}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {integration.status === 'connected' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {integration.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      {integration.status === 'disconnected' && (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                  <div className="space-y-3">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        integration.status === 'connected' 
                          ? 'bg-green-100 text-green-800'
                          : integration.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.status === 'connected' ? 'Connected' :
                         integration.status === 'error' ? 'Error' : 'Not Connected'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                          {feature}
                        </span>
                      ))}
                      {integration.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                          +{integration.features.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <span className="text-xs text-gray-500">
                        Setup: {integration.setupComplexity}
                      </span>
                      <button
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          integration.status === 'connected'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integration Details Modal */}
      {selectedIntegrationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <selectedIntegrationData.icon className={`w-8 h-8 text-${selectedIntegrationData.color}-600`} />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedIntegrationData.name}</h2>
                    <p className="text-gray-600">{selectedIntegrationData.provider}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">{selectedIntegrationData.description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIntegrationData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Setup Instructions</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                      <li>Create an account with {selectedIntegrationData.provider}</li>
                      <li>Generate API keys from your dashboard</li>
                      <li>Enter your credentials in the form below</li>
                      <li>Test the connection</li>
                    </ol>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}