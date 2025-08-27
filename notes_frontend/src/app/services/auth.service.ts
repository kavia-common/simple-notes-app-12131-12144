import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

type User = any;
type Session = any;

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** This is a public function. Observable of the current user. */
  user$: Observable<User | null>;
  /** This is a public function. Observable of the current session. */
  session$: Observable<Session | null>;

  private _user = new BehaviorSubject<User | null>(null);
  private _session = new BehaviorSubject<Session | null>(null);

  constructor(private supabase: SupabaseService) {
    this.user$ = this._user.asObservable();
    this.session$ = this._session.asObservable();

    // Initialize session and user
    (async () => {
      const { data } = await (this.supabase.client as any).auth.getSession();
      this._session.next(data?.session ?? null);
      this._user.next(data?.session?.user ?? null);
      (this.supabase.client as any).auth.onAuthStateChange((_event: string, session: any) => {
        this._session.next(session ?? null);
        this._user.next(session?.user ?? null);
      });
    })();
  }

  // PUBLIC_INTERFACE
  async signIn(email: string, password: string) {
    /** This is a public function. Performs email/password sign in. */
    const { data, error } = await (this.supabase.client as any).auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async signUp(email: string, password: string) {
    /** This is a public function. Performs email/password sign up with redirect. */
    const { getURL } = await import('./url.util');
    const { data, error } = await (this.supabase.client as any).auth.signUp({
      email,
      password,
      options: {
        // Using dynamic site URL ensures dev/prod parity and matches Supabase redirect allowlist
        emailRedirectTo: `${getURL()}`
      },
    });
    if (error) {
      // Minimal surfacing - callers display message
      throw error;
    }
    return data;
  }

  // PUBLIC_INTERFACE
  async signOut() {
    /** This is a public function. Signs out current user. */
    const { error } = await (this.supabase.client as any).auth.signOut();
    if (error) throw error;
  }
}
