import { gql } from "@apollo/client";

export const GET_CATEGORY = gql`
  query getCategory($name: String!) {
    getCategory(name: $name) {
      id
      name
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query getAllCategories {
    getAllCategories {
      name
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query getAllProducts {
    getAllProducts {
      id
      name
      variants {
        size
        price
      }
      category {
        name
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query getProduct($name: String!) {
    getProduct(name: $name) {
      id
      name
    }
  }
`;

export const GET_PRODUCT_VARIANT = gql`
  query getProductVariant($data: SearchProductVariantInput!) {
    getProductVariant(data: $data) {
      id
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query getAllOrders {
    getAllOrders {
      id
      items {
        productVariant {
          size
          price
          product {
            name
          }
        }
        quantity
        subtotal
      }
      total
      status
      userId
    }
  }
`;
