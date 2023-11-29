export const ACCESS_CONTROL_PROVIDER = Symbol('ACCESS_CONTROL_PROVIDER');

export interface RateLimitResult {
  exceeded: boolean;
  tryAfter?: Date;
}

export interface AccessControlProvider {
  validateToken(token: string): Promise<boolean>;
  validateRateLimitForIp(ip: string, weight: number): Promise<RateLimitResult>;
  validateRateLimitForToken(
    token: string,
    weight: number,
  ): Promise<RateLimitResult>;
}
