export type Product = {
  date: Date;
  id: string;
  name: string;
  url: string;
  image: string;
  status: 'Active' | 'Deactivated';
  amount: number;
};

export type ProductData = {
  pagination: {
    totalLength: number;
    itemsPerPage: number;
    pageCount: number;
    currentPage: number;
  };
  data: Product[];
};

export type ProductDetail = {
  id: string;
  url: string;
  image: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  mrr: number;
  createdAt: Date;
  type: 'Physical' | 'Digital';
  shipping?: Shipping[];
};

export type Shipping = {
  name: string;
  id: string;
  maxDay: number;
  minDay: number;
  fee: number;
};
