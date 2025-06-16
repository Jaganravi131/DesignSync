import React, { useState } from 'react';
import { Eye, Code, Download, Smartphone, Monitor, Tablet } from 'lucide-react';
import ModernWebsiteTemplate from './ModernWebsiteTemplate';

const TemplateShowcase = () => {
  const [viewMode, setViewMode] = useState('preview');
  const [deviceView, setDeviceView] = useState('desktop');

  const deviceSizes = {
    desktop: 'w-full',
    tablet: 'w-3/4 max-w-3xl',
    mobile: 'w-80'
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modern Website Template</h1>
            <p className="text-gray-600">Responsive, component-based template for no-code platforms</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 mr-2 inline" />
                Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'code'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 mr-2 inline" />
                Code
              </button>
            </div>

            {/* Device View Toggle */}
            {viewMode === 'preview' && (
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    deviceView === 'desktop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    deviceView === 'tablet'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    deviceView === 'mobile'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'preview' ? (
          <div className="flex justify-center">
            <div className={`${deviceSizes[deviceView]} transition-all duration-300`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="transform origin-top" style={{ 
                  transform: deviceView === 'mobile' ? 'scale(0.8)' : 
                            deviceView === 'tablet' ? 'scale(0.9)' : 'scale(1)' 
                }}>
                  <ModernWebsiteTemplate />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Structure</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Component Hierarchy</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Header (Fixed navigation with dropdown menus)</li>
                    <li>• Hero Section (Main banner with CTA buttons)</li>
                    <li>• Features Section (Grid layout with icons)</li>
                    <li>• Pricing Section (Card-based pricing tiers)</li>
                    <li>• Testimonials Section (Customer reviews)</li>
                    <li>• CTA Section (Call-to-action banner)</li>
                    <li>• Footer (Links and social media)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Design System</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Color Variables: Primary (#3B82F6), Secondary (#10B981), Accent (#F59E0B)</li>
                    <li>• Typography: Responsive heading system (h1-h5) with consistent scaling</li>
                    <li>• Spacing: 8px grid system for consistent layouts</li>
                    <li>• Components: Reusable Button, Card, and Section components</li>
                    <li>• Responsive: Mobile-first approach with breakpoints</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Interactive Elements</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hover effects on cards and buttons</li>
                    <li>• Dropdown navigation menus</li>
                    <li>• Mobile hamburger menu</li>
                    <li>• Smooth transitions and animations</li>
                    <li>• Focus states for accessibility</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Customization Guide</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Update color variables in the colors object</li>
                    <li>• Modify typography scales in the typography object</li>
                    <li>• Adjust spacing using the spacing system</li>
                    <li>• Replace placeholder content with your own</li>
                    <li>• Add or remove sections as needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateShowcase;