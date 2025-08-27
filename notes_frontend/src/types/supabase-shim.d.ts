declare module '@supabase/supabase-js' {
  export type Session = any;
  export type User = any;
  export type SupabaseClient = any;
  export function createClient(url: string, key: string, options?: any): SupabaseClient;
}
