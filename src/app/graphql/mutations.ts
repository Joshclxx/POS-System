  import {gql} from "@apollo/client"

  export const CREATE_PRODUCT = gql`
    mutation createProduct($data: CreateProductInput!) {
      createProduct(data: $data) {
        id
        name
        variants {
          size
          price
        }
        categoryId
      }
    },
  `
  export const CREATE_CATEGORY = gql`
    mutation createCategory($data: CreateCategoryInput!) {
      createCategory(data: $data) {
        name
      }
    }
  `

  export const GET_CATEGORY = gql`
    query getCategory($name: String!) {
      getCategory(name: $name){
        id
        name
      }
    }
  `

  export const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: Int!) {
      deleteProduct(id: $id)
    } 
  `

  export const UPDATE_PRODUCT = gql`
    mutation updateProduct($id: Int!, $edits: EditProductInput!){
      updateProduct(id: $id, edits: $edits) {
        id
        name
        variants {
          size
          price
        }
      }
    }
  `

  export const GET_ALL_PRODUCTS = gql`
    query getAllProducts{
      name
      variants {
        size
        price
      }
      category {
        name
      }
    }
  `

