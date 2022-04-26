import { ShoppinglistDisplayItem } from './shoppinglistDisplayItem';

export interface ShoppinglistStoreGroup {
  products: ShoppinglistDisplayItem[];
  store: string;
}
