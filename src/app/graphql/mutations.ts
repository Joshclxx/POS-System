import {gql} from "@apollo/client"

export const CREATE_MUTATION = gql`
  mutation createProduct($data: [CreateCategoryInput!]!) {
    createProduct(data: {$data}) {
        id
        name
        variants {
            size
            price
        }
        category{
            id
        }
    }
  },

  #FOR MENU
  mutation createCategory($data: [CreateCategoryInput!]!) {
    createCategory(data: {$data}) {
        name
    }
  }
`