import { ShoppinglistDisplayItem } from './shoppinglistDisplayItem';

export interface ShoppinglistStoreGroup {
  store: string;
  products: ShoppinglistDisplayItem[];
}
