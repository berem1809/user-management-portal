export interface User {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  date_of_birth?: string;
  hire_date?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
