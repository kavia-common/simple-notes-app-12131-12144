import { Injectable } from '@angular/core';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  /** This is a public function. Creates or returns the singleton Supabase client. */
  get client(): any {
    if (!this._clientPromise) {
      this._clientPromise = this.createClient();
    }
    // Return a proxy that queues calls until client is ready
    return new Proxy(
      {},
      {
        get: (_target, prop) => {
          return (...args: any[]) => this._clientPromise!.then((client) => (client as any)[prop](...args));
        },
      },
    );
  }

  private _clientPromise: Promise<any> | null = null;

  private async createClient(): Promise<any> {
    const url = (import.meta as any).env?.NG_APP_SUPABASE_URL || '';
    const key = (import.meta as any).env?.NG_APP_SUPABASE_ANON_KEY || '';
    if (!url || !key) {
      console.error('Supabase env vars are missing. Ensure NG_APP_SUPABASE_URL and NG_APP_SUPABASE_ANON_KEY are set.');
    }

    // Try to load module dynamically only at runtime, and guard the import string to avoid bundler static resolution
    let mod: any = null;
    try {
      const modulePath = ['@supabase', 'supabase-js'].join('/'); // prevents static analyzer from resolving immediately
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mod = await import(/* @vite-ignore */ (modulePath));
    } catch (_e) {
      // Fallback to CDN UMD build and use globalThis.supabase
      if (!(globalThis as any).__supabase_loading__) {
        (globalThis as any).__supabase_loading__ = new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.47.10/dist/umd/supabase.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = (err) => reject(err);
          document.head.appendChild(script);
        });
      }
      await (globalThis as any).__supabase_loading__;
      mod = (globalThis as any).supabase;
    }

    const create = mod.createClient || (mod.default && mod.default.createClient);
    if (typeof create !== 'function') {
      throw new Error('Unable to initialize Supabase client: createClient not found');
    }

    const client = create(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return client;
  }
}
