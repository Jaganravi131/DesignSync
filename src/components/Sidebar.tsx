import React from 'react';
import { 
  LayoutDashboard, 
  Paintbrush, 
  Database, 
  Workflow, 
  Plug, 
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'builder', label: 'Page Builder', icon: Paintbrush },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Paintbrush className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">BuilderHub</h1>
            <p className="text-slate-400 text-sm">No-code platform</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = state.activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: item.id as any })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <img
            src={state.user?.avatar}
            alt={state.user?.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{state.user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{state.user?.email}</p>
          </div>
          <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}