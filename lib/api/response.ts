import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(
  status: number,
  code: string,
  message: string,
  init?: ResponseInit,
) {
  return NextResponse.json<ApiErrorBody>(
    { error: { code, message } },
    { ...init, status },
  );
}

export const ApiErrors = {
  badRequest: (message: string) => fail(400, "bad_request", message),
  notFound: (message: string) => fail(404, "not_found", message),
  unprocessable: (message: string) => fail(422, "unprocessable", message),
  rateLimited: (message: string, retryAfterSeconds?: number) =>
    fail(429, "rate_limited", message, {
      headers:
        retryAfterSeconds !== undefined
          ? { "Retry-After": String(retryAfterSeconds) }
          : undefined,
    }),
  serviceUnavailable: (message: string) =>
    fail(503, "service_unavailable", message),
  internal: (message: string) => fail(500, "internal_error", message),
};
