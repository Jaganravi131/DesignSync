import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreHorizontal,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Design {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  status: string;
  lastModified: string;
  owner: any;
  collaborators: any[];
}

const categories = [
  { id: 'all', label: 'All Designs', count: 0 },
  { id: 'social-media', label: 'Social Media', count: 0 },
  { id: 'business', label: 'Business', count: 0 },
  { id: 'marketing', label: 'Marketing', count: 0 },
  { id: 'personal', label: 'Personal', count: 0 }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadDesigns();
  }, [selectedCategory, searchQuery]);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await axios.get(`/api/designs?${params.toString()}`);
      setDesigns(response.data);
    } catch (error: any) {
      console.error('Load designs error:', error);
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const createDesign = async (templateData?: any) => {
    try {
      const designData = {
        title: 'Untitled Design',
        category: templateData?.category || 'social-media',
        dimensions: templateData?.dimensions || { width: 1080, height: 1080 },
        data: templateData?.data || {}
      };

      const response = await axios.post('/api/designs', designData);
      toast.success('Design created successfully');
      setShowCreateModal(false);
      // Navigate to editor
      window.location.href = `/design/${response.data._id}`;
    } catch (error: any) {
      console.error('Create design error:', error);
      toast.error('Failed to create design');
    }
  };

  const duplicateDesign = async (design: Design) => {
    try {
      const designData = {
        title: `${design.title} (Copy)`,
        category: design.category,
        dimensions: (design as any).dimensions,
        data: (design as any).data
      };

      const response = await axios.post('/api/designs', designData);
      toast.success('Design duplicated successfully');
      loadDesigns();
    } catch (error: any) {
      console.error('Duplicate design error:', error);
      toast.error('Failed to duplicate design');
    }
  };

  const deleteDesign = async (designId: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;

    try {
      await axios.delete(`/api/designs/${designId}`);
      toast.success('Design deleted successfully');
      loadDesigns();
    } catch (error: any) {
      console.error('Delete design error:', error);
      toast.error('Failed to delete design');
    }
  };

  const filteredDesigns = designs.filter(design => {
    if (selectedCategory !== 'all' && design.category !== selectedCategory) return false;
    if (searchQuery && !design.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Continue working on your designs or start something new
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Design</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Designs</p>
                <p className="text-2xl font-bold text-gray-900">{designs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {designs.filter(d => d.status === 'published').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collaborators</p>
                <p className="text-2xl font-bold text-gray-900">
                  {designs.reduce((acc, d) => acc + d.collaborators.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {designs.filter(d => 
                    new Date(d.lastModified).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
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

            {/* Search and View Controls */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex-1 lg:flex-none">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search designs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
                  />
                </div>
              </form>

              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Designs Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first design to get started'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Design
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div key={design._id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {design.thumbnail ? (
                      <img
                        src={design.thumbnail}
                        alt={design.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Grid className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      design.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {design.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{design.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDistanceToNow(new Date(design.lastModified), { addSuffix: true })}</span>
                    {design.collaborators.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{design.collaborators.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Link
                      to={`/design/${design._id}`}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => duplicateDesign(design)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteDesign(design._id)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredDesigns.map((design) => (
                <div key={design._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {design.thumbnail ? (
                        <img
                          src={design.thumbnail}
                          alt={design.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Grid className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{design.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          design.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {design.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{design.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Modified {formatDistanceToNow(new Date(design.lastModified), { addSuffix: true })}</span>
                        <span className="capitalize">{design.category.replace('-', ' ')}</span>
                        {design.collaborators.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{design.collaborators.length} collaborators</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/design/${design._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => duplicateDesign(design)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteDesign(design._id)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Design Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Design</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => createDesign({ category: 'social-media', dimensions: { width: 1080, height: 1080 } })}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">Social Media Post</h4>
                  <p className="text-sm text-gray-600">1080 x 1080 px</p>
                </button>
                
                <button
                  onClick={() => createDesign({ category: 'business', dimensions: { width: 1920, height: 1080 } })}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">Presentation Slide</h4>
                  <p className="text-sm text-gray-600">1920 x 1080 px</p>
                </button>
                
                <button
                  onClick={() => createDesign({ category: 'marketing', dimensions: { width: 1200, height: 630 } })}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900">Banner</h4>
                  <p className="text-sm text-gray-600">1200 x 630 px</p>
                </button>
                
                <Link
                  to="/templates"
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left block"
                  onClick={() => setShowCreateModal(false)}
                >
                  <h4 className="font-medium text-gray-900">Browse Templates</h4>
                  <p className="text-sm text-gray-600">Start with a pre-designed template</p>
                </Link>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}