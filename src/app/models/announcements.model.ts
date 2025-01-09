export interface Announcement {
  id: string;
  name: string;
  url: string;
  dateFrom: string; // ISO date string
  dateTo: string; // ISO date string
  pictureUrl: string | null;
}

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface AnnouncementsResponse {
  content: Announcement[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
export interface Columns {
  name: string;
  url: string;
  dateFrom: string;
  dateTo: string;
  actions: string;
}
