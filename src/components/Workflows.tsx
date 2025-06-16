import React, { useState } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Edit,
  Zap,
  Mail,
  Database,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const mockWorkflows = [
  {
    id: '1',
    name: 'Welcome Email Sequence',
    description: 'Send welcome emails to new users',
    trigger: { type: 'user_signup', label: 'User Signs Up' },
    actions: [
      { type: 'send_email', label: 'Send Welcome Email', icon: Mail },
      { type: 'create_record', label: 'Create User Profile', icon: Database },
      { type: 'send_email', label: 'Send Onboarding Tips (3 days)', icon: Mail }
    ],
    active: true,
    executions: 127,
    lastRun: '2 hours ago'
  },
  {
    id: '2',
    name: 'Payment Processing',
    description: 'Handle successful payments and fulfillment',
    trigger: { type: 'payment_success', label: 'Payment Successful' },
    actions: [
      { type: 'create_record', label: 'Create Order', icon: Database },
      { type: 'send_email', label: 'Send Receipt', icon: Mail },
      { type: 'api_request', label: 'Update Inventory', icon: Zap }
    ],
    active: true,
    executions: 45,
    lastRun: '15 minutes ago'
  },
  {
    id: '3',
    name: 'Abandoned Cart Recovery',
    description: 'Follow up on abandoned shopping carts',
    trigger: { type: 'schedule', label: 'Daily at 10 AM' },
    actions: [
      { type: 'send_email', label: 'Send Reminder Email', icon: Mail },
      { type: 'send_notification', label: 'Push Notification', icon: Zap }
    ],
    active: false,
    executions: 0,
    lastRun: 'Never'
  }
];

const triggerTypes = [
  { id: 'form_submit', label: 'Form Submission', icon: Database },
  { id: 'user_signup', label: 'User Signs Up', icon: Zap },
  { id: 'payment_success', label: 'Payment Success', icon: CheckCircle },
  { id: 'api_call', label: 'API Call', icon: Zap },
  { id: 'schedule', label: 'Schedule', icon: Clock }
];

const actionTypes = [
  { id: 'send_email', label: 'Send Email', icon: Mail },
  { id: 'create_record', label: 'Create Database Record', icon: Database },
  { id: 'api_request', label: 'Make API Request', icon: Zap },
  { id: 'update_user', label: 'Update User', icon: Settings },
  { id: 'send_notification', label: 'Send Notification', icon: AlertCircle }
];

export function Workflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'builder'>('list');

  return (
    <div className="flex-1 flex h-full bg-gray-50">
      {/* Workflows Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Workflows</h2>
            <button
              onClick={() => {
                setIsCreating(true);
                setViewMode('builder');
              }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('builder')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'builder'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Builder
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {mockWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  selectedWorkflow === workflow.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate">{workflow.name}</h3>
                  <div className="flex items-center space-x-1">
                    {workflow.active ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Executions</span>
                    <span className="font-medium">{workflow.executions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last run</span>
                    <span className="font-medium">{workflow.lastRun}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'list' ? (
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-6">
                {mockWorkflows.map((workflow) => (
                  <div key={workflow.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            workflow.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {workflow.active ? (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <Pause className="w-3 h-3 mr-1" />
                                Paused
                              </>
                            )}
                          </span>
                        </div>
                        <p className="text-gray-600">{workflow.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Workflow Flow */}
                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                      {/* Trigger */}
                      <div className="flex-shrink-0 bg-blue-50 border border-blue-200 rounded-lg p-3 min-w-48">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Trigger</span>
                        </div>
                        <p className="text-sm text-blue-800">{workflow.trigger.label}</p>
                      </div>

                      {/* Actions */}
                      {workflow.actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <React.Fragment key={index}>
                            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg p-3 min-w-48">
                              <div className="flex items-center space-x-2 mb-1">
                                <Icon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">Action {index + 1}</span>
                              </div>
                              <p className="text-sm text-gray-700">{action.label}</p>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{workflow.executions}</p>
                        <p className="text-sm text-gray-600">Total Executions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {workflow.active ? '100%' : '0%'}
                        </p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
                        <p className="text-sm text-gray-600">Last Executed</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Workflow Builder */
          <div className="flex-1 flex">
            {/* Builder Canvas */}
            <div className="flex-1 p-8 bg-gray-100">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {isCreating ? 'Create New Workflow' : 'Edit Workflow'}
                  </h3>

                  {/* Workflow Builder Interface */}
                  <div className="space-y-6">
                    {/* Trigger Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">When this happens...</h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to select a trigger</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>

                    {/* Actions Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Do this...</h4>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Add your first action</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setViewMode('list');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Save Workflow
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Library */}
            <div className="w-80 bg-white border-l border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Components</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Triggers</h4>
                  <div className="space-y-2">
                    {triggerTypes.map((trigger) => {
                      const Icon = trigger.icon;
                      return (
                        <div
                          key={trigger.id}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{trigger.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Actions</h4>
                  <div className="space-y-2">
                    {actionTypes.map((action) => {
                      const Icon = action.icon;
                      return (
                        <div
                          key={action.id}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{action.label}</span>
                        </div>
                      );
                    })}
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