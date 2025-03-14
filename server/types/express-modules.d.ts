declare module 'helmet' {
  import { RequestHandler } from 'express';
  
  interface HelmetOptions {
    contentSecurityPolicy?: boolean | {
      directives?: {
        [key: string]: string[];
      };
    };
    crossOriginEmbedderPolicy?: boolean;
    [key: string]: any;
  }
  
  function helmet(options?: HelmetOptions): RequestHandler;
  
  export = helmet;
}

declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';
  
  interface RateLimitOptions {
    windowMs?: number;
    max?: number;
    message?: string;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    [key: string]: any;
  }
  
  function rateLimit(options?: RateLimitOptions): RequestHandler;
  
  export = rateLimit;
}

declare module 'express-mongo-sanitize' {
  import { RequestHandler } from 'express';
  
  function mongoSanitize(options?: any): RequestHandler;
  
  export = mongoSanitize;
}

declare module 'xss-clean' {
  import { RequestHandler } from 'express';
  
  function xss(): RequestHandler;
  
  export = xss;
}

declare module 'hpp' {
  import { RequestHandler } from 'express';
  
  interface HppOptions {
    whitelist?: string[];
    [key: string]: any;
  }
  
  function hpp(options?: HppOptions): RequestHandler;
  
  export = hpp;
}

declare module 'cors' {
  import { RequestHandler } from 'express';
  
  interface CorsOptions {
    origin?: string | string[] | boolean | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    [key: string]: any;
  }
  
  function cors(options?: CorsOptions): RequestHandler;
  
  export = cors;
}

declare module 'cookie-parser' {
  import { RequestHandler } from 'express';
  
  function cookieParser(secret?: string | string[], options?: any): RequestHandler;
  
  export = cookieParser;
} 