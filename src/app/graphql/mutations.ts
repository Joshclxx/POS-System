  import {gql} from "@apollo/client"

  export const CREATE_USER = gql`
    mutation createUser($data: CreateUserInput!) {
      createUser(data: $data) {
        firstname
        middlename
        lastname
        suffix
        gender
        email
        password
        role
      }
    }
  `

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

  export const DELETE_CATEGORY = gql`
    mutation deleteCategory($name: String!) {
      deleteCategory(name: $name){
        name
      }
    }
  `



  export const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: Int!) {
      deleteProduct(id: $id) {
        id
      }
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

  export const CREATE_ORDER = gql`
    mutation createOrder($data: CreateOrderInput!){
      createOrder(data: $data) {
        items {
          productName
          productSize
          productPrice
          quantity
          subtotal
        }
        total
        status
        userId
      }
    }
  `

export const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($data: UpdateOrderStatusInput!){
    updateOrderStatus(data: $data){
      id
      status
    }
  }
`

export const VOID_ORDER = gql`
  mutation createVoidOrder($data: CreateVoidOrderInput!) {
    createVoidOrder(data: $data){
      orderId
      shiftId
      userId
      createdAt
    }
  }
`
