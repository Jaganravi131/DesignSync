import React, { useState } from 'react';
import { Plus, Eye, Code, Settings, Smartphone, Monitor, Tablet, Save, Undo, Redo, Grid3X3, Type, Image, Donut as Button, Square } from 'lucide-react';
import { useApp } from '../context/AppContext';

const componentLibrary = [
  { id: 'header', name: 'Header', icon: Grid3X3, category: 'layout' },
  { id: 'hero', name: 'Hero Section', icon: Square, category: 'content' },
  { id: 'text', name: 'Text Block', icon: Type, category: 'content' },
  { id: 'image', name: 'Image', icon: Image, category: 'media' },
  { id: 'button', name: 'Button', icon: Button, category: 'content' },
  { id: 'form', name: 'Contact Form', icon: Square, category: 'form' },
  { id: 'gallery', name: 'Gallery', icon: Grid3X3, category: 'media' },
  { id: 'testimonials', name: 'Testimonials', icon: Square, category: 'content' },
  { id: 'pricing', name: 'Pricing Table', icon: Grid3X3, category: 'ecommerce' },
  { id: 'footer', name: 'Footer', icon: Square, category: 'layout' },
];

const mockPageComponents = [
  {
    id: '1',
    type: 'hero',
    name: 'Hero Section',
    props: {
      title: 'Build Amazing Web Apps',
      subtitle: 'Create fully functional MVPs without writing code',
      backgroundImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600'
    }
  },
  {
    id: '2',
    type: 'feature',
    name: 'Features Section',
    props: {
      title: 'Powerful Features',
      features: [
        { title: 'Drag & Drop Builder', description: 'Intuitive visual interface' },
        { title: 'Database Designer', description: 'Visual data modeling' },
        { title: 'Workflow Automation', description: 'Automated business logic' }
      ]
    }
  }
];

export function PageBuilder() {
  const { state, dispatch } = useApp();
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'components' | 'properties'>('components');

  const handleAddComponent = (componentType: string) => {
    const newComponent = {
      id: Date.now().toString(),
      type: componentType as any,
      name: componentLibrary.find(c => c.id === componentType)?.name || 'Component',
      category: 'content' as any,
      props: {}
    };
    
    dispatch({ type: 'ADD_COMPONENT', payload: newComponent });
  };

  return (
    <div className="flex-1 flex h-full bg-gray-50">
      {/* Component Library Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('components')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'components'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Components
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Properties
            </button>
          </div>
        </div>

        {activeTab === 'components' ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              {['layout', 'content', 'form', 'media', 'ecommerce'].map((category) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 capitalize">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {componentLibrary
                      .filter(comp => comp.category === category)
                      .map((component) => {
                        const Icon = component.icon;
                        return (
                          <button
                            key={component.id}
                            onClick={() => handleAddComponent(component.id)}
                            className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group text-left"
                          >
                            <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 mb-2" />
                            <p className="text-xs font-medium text-gray-900 group-hover:text-blue-900">
                              {component.name}
                            </p>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4">
            <div className="text-center text-gray-500 mt-8">
              <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Select a component to edit its properties</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Undo className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Redo className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedDevice('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedDevice === 'desktop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDevice('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedDevice === 'tablet'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDevice('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedDevice === 'mobile'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_PREVIEW_MODE' })}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  state.previewMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
            selectedDevice === 'desktop' ? 'max-w-full' :
            selectedDevice === 'tablet' ? 'max-w-3xl' : 'max-w-sm'
          }`}>
            {/* Mock Page Content */}
            <div className="relative">
              {mockPageComponents.map((component, index) => (
                <div
                  key={component.id}
                  className="relative group cursor-pointer"
                  onClick={() => dispatch({ type: 'SET_SELECTED_COMPONENT', payload: component as any })}
                >
                  {!state.previewMode && (
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-lg pointer-events-none">
                      <div className="absolute -top-8 left-0 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {component.name}
                      </div>
                    </div>
                  )}

                  {component.type === 'hero' && (
                    <div 
                      className="relative h-96 bg-cover bg-center flex items-center justify-center"
                      style={{ 
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${component.props.backgroundImage})`
                      }}
                    >
                      <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">{component.props.title}</h1>
                        <p className="text-xl mb-8">{component.props.subtitle}</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                          Get Started
                        </button>
                      </div>
                    </div>
                  )}

                  {component.type === 'feature' && (
                    <div className="py-16 px-8">
                      <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">{component.props.title}</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                          {component.props.features.map((feature: any, idx: number) => (
                            <div key={idx} className="text-center">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Grid3X3 className="w-8 h-8 text-blue-600" />
                              </div>
                              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                              <p className="text-gray-600">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {!state.previewMode && mockPageComponents.length === 0 && (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Start building your page</p>
                    <p className="text-sm">Drag components from the sidebar to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}