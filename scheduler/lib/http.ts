import { NextResponse } from "next/server";

type JsonInit = {
  status?: number;
  headers?: Record<string, string>;
};

export function json<T>(body: T, init: JsonInit = {}) {
  return NextResponse.json(body, init);
}

export function errorResponse(status: number, message: string, code?: string) {
  return json(
    {
      ok: false,
      error: message,
      code
    },
    { status }
  );
}
