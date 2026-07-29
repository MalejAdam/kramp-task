const PRODUCT_FIELDS = `
  id
  name
  description
  price
  category
  imageUrl
  stock
  createdAt
`;

export const PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      ${PRODUCT_FIELDS}
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($q: String!) {
    searchProducts(query: $q) {
      ${PRODUCT_FIELDS}
    }
  }
`;
