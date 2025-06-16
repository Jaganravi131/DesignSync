export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  owner: User;
  collaborators: User[];
}

export interface Component {
  id: string;
  type: 'header' | 'hero' | 'feature' | 'testimonial' | 'footer' | 'form' | 'gallery' | 'pricing';
  name: string;
  category: 'layout' | 'content' | 'form' | 'media' | 'ecommerce';
  props: Record<string, any>;
  children?: Component[];
}

export interface DatabaseTable {
  id: string;
  name: string;
  fields: DatabaseField[];
  relationships: Relationship[];
  position: { x: number; y: number };
}

export interface DatabaseField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'file';
  required: boolean;
  unique: boolean;
}

export interface Relationship {
  id: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  fromTable: string;
  toTable: string;
  fromField: string;
  toField: string;
}

export interface WorkflowTrigger {
  id: string;
  type: 'form_submit' | 'user_signup' | 'payment_success' | 'api_call' | 'schedule';
  conditions: Record<string, any>;
}

export interface WorkflowAction {
  id: string;
  type: 'send_email' | 'create_record' | 'api_request' | 'update_user' | 'send_notification';
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  active: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'email' | 'analytics' | 'social' | 'storage' | 'api';
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
}