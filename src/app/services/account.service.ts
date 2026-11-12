import { Injectable, afterNextRender, signal } from '@angular/core';

export interface AccountProfile { id: string; name: string; email: string; phone: string; address: string; city: string; }
interface StoredAccount extends AccountProfile { salt: string; hash: string; }
@Injectable({ providedIn: 'root' })
export class AccountService {
  readonly demoCredentials = { email: 'demo@alamin.test', password: 'AlAmin@123' };
  private readonly key = 'al_amin_accounts_preview_v1';
  private readonly sessionKey = 'al_amin_account_session_v1';
  readonly user = signal<AccountProfile | null>(null);
  readonly ready = signal(false);
  constructor() {
    afterNextRender(() => {
      try { const id = sessionStorage.getItem(this.sessionKey); const account = this.accounts().find(a => a.id === id); if (account) this.user.set(this.profile(account)); } catch { /* Remain signed out if browser storage is unavailable. */ }
      this.ready.set(true);
    });
  }
  private accounts(): StoredAccount[] {
    const value = JSON.parse(localStorage.getItem(this.key) ?? '[]');
    if (!Array.isArray(value)) throw new Error('Account storage is unavailable.');
    return value.filter(a => typeof a?.id === 'string' && typeof a?.email === 'string' && typeof a?.salt === 'string' && typeof a?.hash === 'string');
  }
  private profile(account: StoredAccount): AccountProfile {
    const { id, name, email, phone, address, city } = account;
    return { id, name, email, phone, address, city };
  }
  private async digest(password: string, salt: string): Promise<string> {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 150000, hash: 'SHA-256' }, material, 256);
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  }
  async register(name: string, email: string, password: string): Promise<void> {
    email = email.trim().toLowerCase();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) throw new Error('Enter your name, a valid email and a password of at least 8 characters.');
    const salt = crypto.randomUUID();
    const hash = await this.digest(password, salt);
    const accounts = this.accounts();
    if (accounts.some(a => a.email === email)) throw new Error('An account with this email already exists. Please sign in.');
    const account: StoredAccount = { id: crypto.randomUUID(), name: name.trim(), email, phone: '', address: '', city: '', salt, hash };
    localStorage.setItem(this.key, JSON.stringify([...accounts, account]));
    sessionStorage.setItem(this.sessionKey, account.id);
    this.user.set(this.profile(account));
  }
  async login(email: string, password: string): Promise<void> {
    if (email.trim().toLowerCase() === this.demoCredentials.email) await this.ensureDemoAccount();
    const account = this.accounts().find(a => a.email === email.trim().toLowerCase());
    if (!account || await this.digest(password, account.salt) !== account.hash) throw new Error('Email or password is incorrect. Please try again.');
    sessionStorage.setItem(this.sessionKey, account.id);
    this.user.set(this.profile(account));
  }
  private async ensureDemoAccount(): Promise<void> {
    if (this.accounts().some(account => account.email === this.demoCredentials.email)) return;
    const salt = crypto.randomUUID();
    const hash = await this.digest(this.demoCredentials.password, salt);
    const accounts = this.accounts();
    if (accounts.some(account => account.email === this.demoCredentials.email)) return;
    const account: StoredAccount = { id: crypto.randomUUID(), name: 'Demo Shopper', email: this.demoCredentials.email, phone: '', address: '', city: '', salt, hash };
    localStorage.setItem(this.key, JSON.stringify([...accounts, account]));
  }
  update(details: Omit<AccountProfile, 'id'>): void {
    const current = this.user();
    if (!current) throw new Error('Please sign in to update your details.');
    const email = details.email.trim().toLowerCase();
    if (!details.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter your name and a valid email address.');
    const accounts = this.accounts();
    if (accounts.some(a => a.id !== current.id && a.email === email)) throw new Error('This email is already used by another account.');
    const index = accounts.findIndex(a => a.id === current.id);
    if (index < 0) throw new Error('Your account could not be found. Please sign in again.');
    accounts[index] = { ...accounts[index], ...details, name: details.name.trim(), email, id: current.id };
    localStorage.setItem(this.key, JSON.stringify(accounts));
    this.user.set(this.profile(accounts[index]));
  }
  logout(): void { sessionStorage.removeItem(this.sessionKey); this.user.set(null); }
}
