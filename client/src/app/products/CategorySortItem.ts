import { Product } from './product';

export interface CategorySortItem {
  category: string;
  count: number;
  products: Product[];
}
