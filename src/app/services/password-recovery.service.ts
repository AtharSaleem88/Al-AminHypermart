import { Injectable } from '@angular/core';

/** Recovery for live Al-Amin accounts; local preview accounts are separate. */
@Injectable({ providedIn: 'root' })
export class PasswordRecoveryService {
  private readonly endpoint = 'https://api.al-aminhmb.com/api/account';
  async requestLink(email: string): Promise<void> {
    await this.post('ForgotPassword', { email: this.email(email) });
  }
  async reset(email: string, token: string, newPassword: string): Promise<void> {
    if (!token || token.length > 8192) throw new Error('This reset link is invalid. Please request a new one.');
    if (newPassword.length < 8) throw new Error('Use a password with at least 8 characters.');
    await this.post('ResetPassword', { email: this.email(email), token, newPassword });
  }
  private email(value: string): string {
    const email = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
    if (email === 'demo@alamin.test') throw new Error('The preview demo uses the fixed password AlAmin@123. Enter your live Al-Amin account email to reset its password.');
    return email;
  }
  private async post(action: string, body: object): Promise<void> {
    let response: Response;
    try {
      response = await fetch(`${this.endpoint}/${action}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Client-Db': 'ALAmin' },
        body: JSON.stringify(body), signal: AbortSignal.timeout(15000), credentials: 'omit', cache: 'no-store'
      });
    } catch { throw new Error('Could not reach password recovery. Please try again or contact customer care.'); }
    if (!response.ok) throw new Error(action === 'ResetPassword' ? 'This link may be invalid or expired. Please request a new reset link.' : 'Could not request a reset link. Please check your email and try again.');
  }
}
