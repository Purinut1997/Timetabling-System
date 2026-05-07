declare module 'jsonwebtoken' {
  export interface JwtPayload {
    [key: string]: any;
  }
  
  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: string | Buffer,
    options?: {
      expiresIn?: string | number;
      issuer?: string;
      audience?: string | string[];
      subject?: string;
      jwtid?: string;
      algorithm?: string;
      [key: string]: any;
    }
  ): string;
  
  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: {
      algorithms?: string[];
      audience?: string | string[];
      clockTimestamp?: number;
      clockTolerance?: number;
      complete?: boolean;
      issuer?: string;
      ignoreExpiration?: boolean;
      ignoreNotBefore?: boolean;
      maxAge?: string | number;
      subject?: string;
      [key: string]: any;
    }
  ): JwtPayload | string;
  
  export function decode(
    token: string,
    options?: { complete?: boolean; json?: boolean }
  ): JwtPayload | string | null;
}
