import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Save, 
  Undo, 
  Redo, 
  Download, 
  Share2, 
  Users, 
  MessageCircle,
  Layers,
  Type,
  Image,
  Square,
  Circle,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDesign } from '../contexts/DesignContext';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const tools = [
  { id: 'select', name: 'Select', icon: 'cursor' },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'image', name: 'Image', icon: Image },
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
];

const textStyles = [
  { name: 'Heading 1', fontSize: 48, fontWeight: 'bold' },
  { name: 'Heading 2', fontSize: 36, fontWeight: 'bold' },
  { name: 'Heading 3', fontSize: 24, fontWeight: 'bold' },
  { name: 'Body', fontSize: 16, fontWeight: 'normal' },
  { name: 'Caption', fontSize: 12, fontWeight: 'normal' },
];

export default function DesignEditor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { socket, isConnected, activeUsers } = useSocket();
  const {
    design,
    loading,
    saving,
    selectedElement,
    canvasData,
    updateCanvasData,
    saveDesign,
    setSelectedElement,
    addComment,
    saveVersion
  } = useDesign();

  const [activeTool, setActiveTool] = useState('select');
  const [showLayers, setShowLayers] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [canvasElements, setCanvasElements] = useState<any[]>([]);

  useEffect(() => {
    if (canvasData && canvasData.elements) {
      setCanvasElements(canvasData.elements);
    }
  }, [canvasData]);

  const handleAddElement = (type: string) => {
    const newElement = {
      id: `element_${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      properties: getDefaultProperties(type)
    };

    const updatedElements = [...canvasElements, newElement];
    setCanvasElements(updatedElements);
    updateCanvasData({ ...canvasData, elements: updatedElements });
    setSelectedElement(newElement);
  };

  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'text':
        return {
          text: 'Double click to edit',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          fontWeight: 'normal',
          textAlign: 'left'
        };
      case 'rectangle':
        return {
          fill: '#3B82F6',
          stroke: '#1E40AF',
          strokeWidth: 2,
          borderRadius: 0
        };
      case 'circle':
        return {
          fill: '#EF4444',
          stroke: '#DC2626',
          strokeWidth: 2
        };
      case 'image':
        return {
          src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
          opacity: 1
        };
      default:
        return {};
    }
  };

  const handleElementUpdate = (elementId: string, updates: any) => {
    const updatedElements = canvasElements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    setCanvasElements(updatedElements);
    updateCanvasData({ ...canvasData, elements: updatedElements });
  };

  const handleElementSelect = (element: any) => {
    setSelectedElement(element);
    setActiveTool('select');
  };

  const handleDeleteElement = (elementId: string) => {
    const updatedElements = canvasElements.filter(el => el.id !== elementId);
    setCanvasElements(updatedElements);
    updateCanvasData({ ...canvasData, elements: updatedElements });
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleSave = async () => {
    try {
      await saveDesign();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    try {
      // In a real implementation, you would use html2canvas or similar
      toast.success(`Exporting as ${format.toUpperCase()}...`);
      
      // Mock export functionality
      setTimeout(() => {
        toast.success(`Design exported as ${format.toUpperCase()}`);
      }, 2000);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export design');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Design not found</h2>
          <p className="text-gray-600">The design you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
              {design.title}
            </h1>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>

              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Undo className="w-4 h-4" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Active Users */}
            {activeUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((user, index) => (
                    <img
                      key={user.id || index}
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      title={user.name}
                    />
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>

            {/* Export Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={() => handleExport('png')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as PNG
                </button>
                <button
                  onClick={() => handleExport('jpg')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as JPG
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as PDF
                </button>
              </div>
            </div>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activeTool === tool.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={tool.name}
              >
                {typeof Icon === 'string' ? (
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Left Panel - Properties */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                {activeTool === 'select' && selectedElement ? 'Properties' : 'Add Elements'}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLayers(!showLayers)}
                  className={`p-1 rounded ${showLayers ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className={`p-1 rounded ${showComments ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTool === 'select' && selectedElement ? (
              /* Element Properties */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">X</label>
                      <input
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) => handleElementUpdate(selectedElement.id, { x: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Y</label>
                      <input
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) => handleElementUpdate(selectedElement.id, { y: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Width</label>
                      <input
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) => handleElementUpdate(selectedElement.id, { width: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Height</label>
                      <input
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) => handleElementUpdate(selectedElement.id, { height: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {selectedElement.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text
                      </label>
                      <textarea
                        value={selectedElement.properties.text}
                        onChange={(e) => handleElementUpdate(selectedElement.id, {
                          properties: { ...selectedElement.properties, text: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </label>
                      <input
                        type="number"
                        value={selectedElement.properties.fontSize}
                        onChange={(e) => handleElementUpdate(selectedElement.id, {
                          properties: { ...selectedElement.properties, fontSize: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="color"
                        value={selectedElement.properties.color}
                        onChange={(e) => handleElementUpdate(selectedElement.id, {
                          properties: { ...selectedElement.properties, color: e.target.value }
                        })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle') && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fill Color
                      </label>
                      <input
                        type="color"
                        value={selectedElement.properties.fill}
                        onChange={(e) => handleElementUpdate(selectedElement.id, {
                          properties: { ...selectedElement.properties, fill: e.target.value }
                        })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stroke Color
                      </label>
                      <input
                        type="color"
                        value={selectedElement.properties.stroke}
                        onChange={(e) => handleElementUpdate(selectedElement.id, {
                          properties: { ...selectedElement.properties, stroke: e.target.value }
                        })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteElement(selectedElement.id)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Element
                </button>
              </div>
            ) : (
              /* Add Elements */
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Text</h4>
                  <div className="space-y-2">
                    {textStyles.map((style) => (
                      <button
                        key={style.name}
                        onClick={() => handleAddElement('text')}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div style={{ fontSize: Math.min(style.fontSize, 18), fontWeight: style.fontWeight }}>
                          {style.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Shapes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddElement('rectangle')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
                    >
                      <Square className="w-6 h-6 text-gray-600 mb-1" />
                      <span className="text-xs text-gray-700">Rectangle</span>
                    </button>
                    <button
                      onClick={() => handleAddElement('circle')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
                    >
                      <Circle className="w-6 h-6 text-gray-600 mb-1" />
                      <span className="text-xs text-gray-700">Circle</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Media</h4>
                  <button
                    onClick={() => handleAddElement('image')}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center space-x-3"
                  >
                    <Image className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-700">Add Image</span>
                  </button>
                </div>
              </div>
            )}

            {showLayers && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Layers</h4>
                <div className="space-y-1">
                  {canvasElements.map((element, index) => (
                    <div
                      key={element.id}
                      onClick={() => handleElementSelect(element)}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        selectedElement?.id === element.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="text-sm text-gray-700 capitalize">
                          {element.type} {index + 1}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle visibility
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Eye className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {design.dimensions.width} x {design.dimensions.height}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-white"
              >
                -
              </button>
              <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 overflow-auto p-8">
            <div className="flex items-center justify-center min-h-full">
              <div
                className="bg-white shadow-lg relative"
                style={{
                  width: design.dimensions.width * (zoom / 100),
                  height: design.dimensions.height * (zoom / 100),
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center'
                }}
              >
                {/* Canvas Elements */}
                {canvasElements.map((element) => (
                  <div
                    key={element.id}
                    onClick={() => handleElementSelect(element)}
                    className={`absolute cursor-pointer ${
                      selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height
                    }}
                  >
                    {element.type === 'text' && (
                      <div
                        style={{
                          fontSize: element.properties.fontSize,
                          color: element.properties.color,
                          fontWeight: element.properties.fontWeight,
                          fontFamily: element.properties.fontFamily,
                          textAlign: element.properties.textAlign,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {element.properties.text}
                      </div>
                    )}

                    {element.type === 'rectangle' && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: element.properties.fill,
                          border: `${element.properties.strokeWidth}px solid ${element.properties.stroke}`,
                          borderRadius: element.properties.borderRadius
                        }}
                      />
                    )}

                    {element.type === 'circle' && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: element.properties.fill,
                          border: `${element.properties.strokeWidth}px solid ${element.properties.stroke}`,
                          borderRadius: '50%'
                        }}
                      />
                    )}

                    {element.type === 'image' && (
                      <img
                        src={element.properties.src}
                        alt="Design element"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: element.properties.opacity
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Canvas placeholder when empty */}
                {canvasElements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Layers className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium">Start creating</p>
                      <p className="text-sm">Add elements from the left panel</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Comments (if enabled) */}
        {showComments && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Comments</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No comments yet</p>
                <p className="text-xs text-gray-400">Click anywhere on the canvas to add a comment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}