import { TestBed } from '@angular/core/testing';
import { PasswordRecoveryService } from './password-recovery.service';

describe('Live account password recovery', () => {
  let service: PasswordRecoveryService;
  let request: jasmine.Spy;
  beforeEach(() => {
    service = TestBed.inject(PasswordRecoveryService);
    request = spyOn(window, 'fetch').and.resolveTo(new Response(null, { status: 200 }));
  });
  it('requests reset emails through the existing tenant-aware API', async () => {
    await service.requestLink(' Shopper@example.test ');
    const [url, options] = request.calls.mostRecent().args;
    expect(url).toBe('https://api.al-aminhmb.com/api/account/ForgotPassword');
    expect(JSON.parse(options.body)).toEqual({ email: 'shopper@example.test' });
    expect(options.headers['X-Client-Db']).toBe('ALAmin');
    expect(options.credentials).toBe('omit');
  });
  it('keeps invalid and fixed demo credentials away from the live reset endpoint', async () => {
    await expectAsync(service.requestLink('invalid')).toBeRejected();
    await expectAsync(service.requestLink('demo@alamin.test')).toBeRejectedWithError(/fixed password/);
    expect(request).not.toHaveBeenCalled();
  });
  it('passes the token intact and enforces password requirements', async () => {
    await expectAsync(service.reset('shopper@example.test', '', 'NewPassword123')).toBeRejected();
    await expectAsync(service.reset('shopper@example.test', 'test-token', 'short')).toBeRejected();
    expect(request).not.toHaveBeenCalled();
    await service.reset('shopper@example.test', 'test+token/=', 'NewPassword123');
    expect(JSON.parse(request.calls.mostRecent().args[1].body)).toEqual({ email: 'shopper@example.test', token: 'test+token/=', newPassword: 'NewPassword123' });
  });
  it('reports an expired reset link without claiming success', async () => {
    request.and.resolveTo(new Response(null, { status: 400 }));
    await expectAsync(service.reset('shopper@example.test', 'expired-token', 'NewPassword123')).toBeRejectedWithError(/invalid or expired/);
  });
});
