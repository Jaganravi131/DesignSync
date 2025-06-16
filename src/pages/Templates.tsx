import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, Star, Crown, Eye, Copy } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  dimensions: {
    width: number;
    height: number;
  };
  thumbnail: string;
  preview: string;
  tags: string[];
  isPremium: boolean;
  usageCount: number;
  rating: number;
}

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'business', label: 'Business' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'personal', label: 'Personal' }
];

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, searchQuery, showPremiumOnly]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (showPremiumOnly) params.append('premium', 'true');

      const response = await axios.get(`/api/templates?${params.toString()}`);
      setTemplates(response.data);
    } catch (error: any) {
      console.error('Load templates error:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = async (template: Template) => {
    try {
      const designData = {
        title: `${template.name} Design`,
        category: template.category,
        templateId: template._id,
        dimensions: template.dimensions,
        data: template.data || {}
      };

      const response = await axios.post('/api/designs', designData);
      toast.success('Design created from template');
      // Navigate to editor
      window.location.href = `/design/${response.data._id}`;
    } catch (error: any) {
      console.error('Use template error:', error);
      toast.error('Failed to create design from template');
    }
  };

  const previewTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  // Mock templates for demo
  const mockTemplates: Template[] = [
    {
      _id: '1',
      name: 'Instagram Post - Modern',
      description: 'Clean and modern Instagram post template',
      category: 'social-media',
      subcategory: 'instagram',
      dimensions: { width: 1080, height: 1080 },
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      preview: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800&h=800',
      tags: ['modern', 'clean', 'instagram'],
      isPremium: false,
      usageCount: 1250,
      rating: 4.8
    },
    {
      _id: '2',
      name: 'Business Card - Professional',
      description: 'Professional business card template',
      category: 'business',
      subcategory: 'cards',
      dimensions: { width: 1050, height: 600 },
      thumbnail: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      preview: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      tags: ['business', 'professional', 'card'],
      isPremium: true,
      usageCount: 890,
      rating: 4.9
    },
    {
      _id: '3',
      name: 'Facebook Cover - Creative',
      description: 'Creative Facebook cover template',
      category: 'social-media',
      subcategory: 'facebook',
      dimensions: { width: 1640, height: 859 },
      thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      preview: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
      tags: ['facebook', 'creative', 'cover'],
      isPremium: false,
      usageCount: 2100,
      rating: 4.7
    },
    {
      _id: '4',
      name: 'Marketing Flyer - Bold',
      description: 'Bold marketing flyer template',
      category: 'marketing',
      subcategory: 'flyers',
      dimensions: { width: 1080, height: 1350 },
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000',
      tags: ['marketing', 'flyer', 'bold'],
      isPremium: true,
      usageCount: 756,
      rating: 4.6
    },
    {
      _id: '5',
      name: 'LinkedIn Banner - Minimal',
      description: 'Minimal LinkedIn banner template',
      category: 'social-media',
      subcategory: 'linkedin',
      dimensions: { width: 1584, height: 396 },
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      preview: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=200',
      tags: ['linkedin', 'minimal', 'banner'],
      isPremium: false,
      usageCount: 1450,
      rating: 4.8
    },
    {
      _id: '6',
      name: 'Presentation Slide - Corporate',
      description: 'Corporate presentation slide template',
      category: 'business',
      subcategory: 'presentations',
      dimensions: { width: 1920, height: 1080 },
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
      preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=450',
      tags: ['presentation', 'corporate', 'slide'],
      isPremium: true,
      usageCount: 980,
      rating: 4.9
    }
  ];

  const displayTemplates = templates.length > 0 ? templates : mockTemplates;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
          <p className="text-gray-600">
            Choose from our collection of professionally designed templates
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Premium only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : displayTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayTemplates.map((template) => (
              <div key={template._id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="relative">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {template.isPremium && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => previewTemplate(template)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                      <button
                        onClick={() => previewTemplate(template)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => useTemplate(template)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                    <span>{template.usageCount.toLocaleString()} uses</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => useTemplate(template)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedTemplate.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <img
                      src={selectedTemplate.preview}
                      alt={selectedTemplate.name}
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>

                  <div className="lg:w-80">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Template Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="capitalize">{selectedTemplate.category.replace('-', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dimensions:</span>
                            <span>{selectedTemplate.dimensions.width} x {selectedTemplate.dimensions.height}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              <span>{selectedTemplate.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Uses:</span>
                            <span>{selectedTemplate.usageCount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedTemplate.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <button
                          onClick={() => useTemplate(selectedTemplate)}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Use This Template
                        </button>
                        <button
                          onClick={() => setSelectedTemplate(null)}
                          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Close Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}