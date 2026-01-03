export const successResponse = (message: string, data: any = null) => {
  return {
    success: true,
    message,
    data,
    error: null,
  };
};

export const errorResponse = (message: string, code?: string, details?: any) => {
  return {
    success: false,
    message,
    data: null,
    error: {
      code: code || 'GEN_003',
      details: details || null,
    },
  };
};

export const paginationMeta = (total: number, page: number, limit: number) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
