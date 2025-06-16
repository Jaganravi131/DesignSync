import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface Design {
  _id: string;
  title: string;
  description: string;
  category: string;
  owner: any;
  collaborators: any[];
  data: any;
  dimensions: {
    width: number;
    height: number;
  };
  thumbnail: string;
  status: string;
  versions: any[];
  comments: any[];
  tags: string[];
  isPublic: boolean;
  lastModified: string;
  lastModifiedBy: any;
}

interface DesignContextType {
  design: Design | null;
  loading: boolean;
  saving: boolean;
  selectedElement: any;
  canvasData: any;
  updateDesign: (updates: Partial<Design>) => Promise<void>;
  updateCanvasData: (data: any) => void;
  saveDesign: () => Promise<void>;
  setSelectedElement: (element: any) => void;
  addComment: (comment: any) => void;
  saveVersion: (description?: string) => Promise<void>;
}

const DesignContext = createContext<DesignContextType | null>(null);

export function DesignProvider({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [canvasData, setCanvasData] = useState<any>(null);

  // Load design
  useEffect(() => {
    if (id) {
      loadDesign();
    }
  }, [id]);

  // Join design room
  useEffect(() => {
    if (socket && design && user) {
      socket.emit('join-design', {
        designId: design._id,
        userId: user.id,
        token: localStorage.getItem('designsync_token')
      });
    }
  }, [socket, design, user]);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('design-updated', (data) => {
        console.log('Design updated by another user:', data);
        if (data.userId !== user?.id) {
          setCanvasData(data.canvasData);
          toast.success(`Design updated by ${data.userName || 'another user'}`);
        }
      });

      socket.on('comment-added', (comment) => {
        console.log('Comment added:', comment);
        setDesign(prev => prev ? {
          ...prev,
          comments: [...prev.comments, comment]
        } : null);
      });

      return () => {
        socket.off('design-updated');
        socket.off('comment-added');
      };
    }
  }, [socket, user]);

  const loadDesign = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/designs/${id}`);
      const designData = response.data;
      setDesign(designData);
      setCanvasData(designData.data);
    } catch (error: any) {
      console.error('Load design error:', error);
      toast.error(error.response?.data?.error || 'Failed to load design');
    } finally {
      setLoading(false);
    }
  };

  const updateDesign = async (updates: Partial<Design>) => {
    if (!design) return;

    try {
      const response = await axios.put(`/api/designs/${design._id}`, updates);
      setDesign(response.data);
      toast.success('Design updated successfully');
    } catch (error: any) {
      console.error('Update design error:', error);
      toast.error(error.response?.data?.error || 'Failed to update design');
      throw error;
    }
  };

  const updateCanvasData = (data: any) => {
    setCanvasData(data);
    
    // Emit real-time update
    if (socket && design) {
      socket.emit('design-update', {
        designId: design._id,
        canvasData: data,
        userName: user?.name
      });
    }
  };

  const saveDesign = async () => {
    if (!design || !canvasData) return;

    try {
      setSaving(true);
      await axios.put(`/api/designs/${design._id}`, {
        data: canvasData,
        lastModified: new Date().toISOString()
      });
      toast.success('Design saved successfully');
    } catch (error: any) {
      console.error('Save design error:', error);
      toast.error(error.response?.data?.error || 'Failed to save design');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const addComment = (comment: any) => {
    if (socket && design) {
      socket.emit('add-comment', {
        designId: design._id,
        text: comment.text,
        position: comment.position
      });
    }
  };

  const saveVersion = async (description?: string) => {
    if (!design || !canvasData) return;

    try {
      const response = await axios.post(`/api/designs/${design._id}/versions`, {
        data: canvasData,
        description: description || `Version ${design.versions.length + 1}`,
        thumbnail: design.thumbnail
      });
      
      setDesign(prev => prev ? {
        ...prev,
        versions: [...prev.versions, response.data]
      } : null);
      
      toast.success('Version saved successfully');
    } catch (error: any) {
      console.error('Save version error:', error);
      toast.error(error.response?.data?.error || 'Failed to save version');
      throw error;
    }
  };

  return (
    <DesignContext.Provider value={{
      design,
      loading,
      saving,
      selectedElement,
      canvasData,
      updateDesign,
      updateCanvasData,
      saveDesign,
      setSelectedElement,
      addComment,
      saveVersion
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}