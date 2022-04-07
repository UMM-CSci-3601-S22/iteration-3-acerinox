import { ProductCategory } from '../products/product';

export interface PantryItem {
  _id: string;
  product: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  purchase_date: string;
  notes?: string;

}

export interface ComboItem {
  _id: string; // PantryItem
  // eslint-disable-next-line @typescript-eslint/naming-convention
  purchase_date: string; // PantryItem
  productName: string; // Product
  description?: string; // Product
  brand: string; // Product
  category: ProductCategory; // Product
  store: string; // Product
  location?: string; // Product
  notes?: string; // PantryItem
  tags?: string[]; // Product
  lifespan?: number; // Product
  threshold?: number; // Product
  image?: string; // Product
}
