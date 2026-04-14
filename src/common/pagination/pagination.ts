export type PaginationInput = {
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: PaginationMeta;
};

const clampInt = (
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.trunc(n);
  return Math.min(Math.max(i, min), max);
};

export const normalizePagination = (
  input: PaginationInput,
  options?: { defaultPage?: number; defaultLimit?: number; maxLimit?: number },
) => {
  const defaultPage = options?.defaultPage ?? 1;
  const defaultLimit = options?.defaultLimit ?? 10;
  const maxLimit = options?.maxLimit ?? 100;

  const page = clampInt(input.page, defaultPage, 1, Number.MAX_SAFE_INTEGER);
  const limit = clampInt(input.limit, defaultLimit, 1, maxLimit);

  const skip = (page - 1) * limit;
  const take = limit;

  return { page, limit, skip, take };
};

export const buildPaginationMeta = (args: {
  page: number;
  limit: number;
  totalItems: number;
}): PaginationMeta => {
  const { page, limit, totalItems } = args;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
