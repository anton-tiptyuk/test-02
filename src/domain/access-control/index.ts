export const ACCESS_CONTROL_PROVIDER = Symbol('ACCESS_CONTROL_PROVIDER');

export interface AccessControlProvider {
  validateToken(token: string): Promise<boolean>;
}
