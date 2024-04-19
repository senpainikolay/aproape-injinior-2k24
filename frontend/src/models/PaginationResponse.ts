export interface PaginationResponse<T> {
    data: T[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};
