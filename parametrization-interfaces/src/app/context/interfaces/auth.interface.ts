export interface AuthContextType {
  user: UserInterface | undefined;
  login: (email: string, password: string) => Promise<void>;
  recovery_pass: (email: string, password: string, password_confirm: string) => Promise<void>;
  logout: () => void;
  getUserRolName: () => string | null;
  isRolAdmin: () => boolean;
  getPermissons: () => string[];
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

export interface UserInterface {
    _id?: string;
    access_token: string;
    avatar: string;
    username: string;
    email: string;
    password: string;
    customer: CustomerInterface;
    rol: RoleInterface;
    createdAt: string;
    updatedAt: string;
    status: boolean;
}

export interface CustomerInterface {
    _id: string;
    name: string;
    identitycation_type: string;
    identificacion?: string;
    createdAt: string;
    updatedAt: string;
    status: boolean;
}

export interface RoleInterface {
    _id: string;
    name: string;
    description: string;
    permissons: string[];
    isAdmin: boolean;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}