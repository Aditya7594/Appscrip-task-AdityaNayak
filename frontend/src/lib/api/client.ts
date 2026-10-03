import 'server-only';
import { ApiError } from './errors';
import { ApiErrorBody } from '@/types/product';

export interface ApiFetchOptions {
  query?: Record<string, string | number | boolean | undefined>;
  revalidate?: number | false;
  cache?: RequestCache;
}

const DEFAULT_BASE_URL = 'http://localhost:4000';

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const baseUrl = process.env.API_BASE_URL || DEFAULT_BASE_URL;
  const url = new URL(path.startsWith('/') ? path : `/${path}`, baseUrl);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const fetchOptions: RequestInit = {
    signal: AbortSignal.timeout(15000),
  };

  if (options.cache) {
    fetchOptions.cache = options.cache;
  }

  if (options.revalidate !== undefined) {
    fetchOptions.next = {
      revalidate: options.revalidate,
    };
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), fetchOptions);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(503, 'API unreachable');
  }

  if (!response.ok) {
    let errorMessage = response.statusText || 'API Error';
    let errorBody: ApiErrorBody | undefined;

    try {
      const data = (await response.json()) as ApiErrorBody;
      errorBody = data;
      if (data && data.message) {
        errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      }
    } catch {
      // Body is not JSON
    }

    throw new ApiError(response.status, errorMessage, errorBody);
  }

  return (await response.json()) as T;
}
