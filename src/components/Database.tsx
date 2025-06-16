import React, { useState } from 'react';
import { 
  Plus, 
  Database as DatabaseIcon, 
  Table, 
  Key, 
  Link, 
  Search,
  Settings,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const mockTables = [
  {
    id: '1',
    name: 'users',
    fields: [
      { id: '1', name: 'id', type: 'text', required: true, unique: true },
      { id: '2', name: 'email', type: 'email', required: true, unique: true },
      { id: '3', name: 'name', type: 'text', required: true, unique: false },
      { id: '4', name: 'created_at', type: 'date', required: true, unique: false },
    ],
    relationships: [],
    position: { x: 100, y: 100 }
  },
  {
    id: '2',
    name: 'products',
    fields: [
      { id: '1', name: 'id', type: 'text', required: true, unique: true },
      { id: '2', name: 'name', type: 'text', required: true, unique: false },
      { id: '3', name: 'price', type: 'number', required: true, unique: false },
      { id: '4', name: 'description', type: 'text', required: false, unique: false },
      { id: '5', name: 'user_id', type: 'text', required: true, unique: false },
    ],
    relationships: [
      { id: '1', type: 'many-to-one', fromTable: 'products', toTable: 'users', fromField: 'user_id', toField: 'id' }
    ],
    position: { x: 400, y: 100 }
  },
  {
    id: '3',
    name: 'orders',
    fields: [
      { id: '1', name: 'id', type: 'text', required: true, unique: true },
      { id: '2', name: 'user_id', type: 'text', required: true, unique: false },
      { id: '3', name: 'product_id', type: 'text', required: true, unique: false },
      { id: '4', name: 'quantity', type: 'number', required: true, unique: false },
      { id: '5', name: 'total', type: 'number', required: true, unique: false },
      { id: '6', name: 'status', type: 'text', required: true, unique: false },
    ],
    relationships: [
      { id: '1', type: 'many-to-one', fromTable: 'orders', toTable: 'users', fromField: 'user_id', toField: 'id' },
      { id: '2', type: 'many-to-one', fromTable: 'orders', toTable: 'products', fromField: 'product_id', toField: 'id' }
    ],
    position: { x: 700, y: 100 }
  }
];

const fieldTypes = ['text', 'number', 'boolean', 'date', 'email', 'url', 'file'];

export function Database() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [viewMode, setViewMode] = useState<'visual' | 'schema'>('visual');

  const selectedTableData = mockTables.find(table => table.id === selectedTable);

  return (
    <div className="flex-1 flex h-full bg-gray-50">
      {/* Schema Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Database Schema</h2>
            <button
              onClick={() => setIsCreatingTable(true)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'visual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setViewMode('schema')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'schema'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Schema
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isCreatingTable ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Name
                </label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter table name..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsCreatingTable(false);
                    setNewTableName('');
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  disabled={!newTableName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {mockTables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedTable === table.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Table className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{table.name}</h3>
                      <p className="text-sm text-gray-500">{table.fields.length} fields</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'visual' ? (
          /* Visual Database Designer */
          <div className="flex-1 relative bg-gray-100 overflow-auto">
            <div className="absolute inset-0 p-8">
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Render Tables */}
              {mockTables.map((table) => (
                <div
                  key={table.id}
                  className="absolute bg-white rounded-lg shadow-lg border border-gray-200 min-w-64"
                  style={{
                    left: table.position.x,
                    top: table.position.y,
                  }}
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DatabaseIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{table.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2">
                      {table.fields.map((field) => (
                        <div key={field.id} className="flex items-center space-x-2 text-sm">
                          {field.unique && <Key className="w-3 h-3 text-yellow-600" />}
                          <span className={`font-medium ${field.required ? 'text-gray-900' : 'text-gray-600'}`}>
                            {field.name}
                          </span>
                          <span className="text-gray-500">({field.type})</span>
                          {field.required && <span className="text-red-500">*</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Render Relationships */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {mockTables.flatMap(table => 
                  table.relationships.map(rel => {
                    const fromTable = mockTables.find(t => t.name === rel.fromTable);
                    const toTable = mockTables.find(t => t.name === rel.toTable);
                    
                    if (!fromTable || !toTable) return null;
                    
                    const startX = fromTable.position.x + 128;
                    const startY = fromTable.position.y + 100;
                    const endX = toTable.position.x + 128;
                    const endY = toTable.position.y + 100;
                    
                    return (
                      <line
                        key={rel.id}
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke="#6366f1"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })
                )}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6366f1"
                    />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        ) : (
          /* Schema View */
          <div className="flex-1 p-8">
            {selectedTableData ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{selectedTableData.name}</h2>
                        <p className="text-gray-600 mt-1">{selectedTableData.fields.length} fields</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Add Field</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Field Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Required
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unique
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTableData.fields.map((field) => (
                          <tr key={field.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {field.unique && <Key className="w-4 h-4 text-yellow-600 mr-2" />}
                                <span className="text-sm font-medium text-gray-900">{field.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                {field.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                field.required 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {field.required ? 'Required' : 'Optional'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                field.unique 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {field.unique ? 'Unique' : 'Not Unique'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <DatabaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a table to view details</h3>
                  <p className="text-gray-600">Choose a table from the sidebar to see its schema and fields</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}