export interface Article {
  id: string;
  title: string;
  url: string;
  text: number;
  category: number;
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

export interface ArticleResponse {
  content: Article[];
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
  originalPrice: string;
  discount: string;
  actions: string;
}
