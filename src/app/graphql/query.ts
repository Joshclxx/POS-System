import {gql} from "@apollo/client"

export const GET_CATEGORY = gql`
query getCategory($name: String!) {
  getCategory(name: $name){
    id
    name
  }
}
`

export const GET_ALL_CATEGORIES = gql`
query getAllCategories{
  getAllCategories{
    name
  }
}
`

export const GET_ALL_PRODUCTS = gql`
query getAllProducts{
  getAllProducts{
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
`

export const GET_PRODUCT = gql`
query getProduct($id: Int!){
    getProduct(id: $id){
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
`

