import { gql } from "@apollo/client";

export const typeDefs = gql`
  enum Role {
    CASHIER
    MANAGER
    ADMIN
  }

  enum ShiftType {
    OPENING
    CLOSING
  }

  enum STATUS {
    QUEUE
    COMPLETED
    VOIDED
  }

  enum Size {
    PT
    RG
    GR
  }

  type User {
    id: ID!
    firstname: String!
    middlename: String!
    lastname: String!
    age: Int!
    email: String!
    password: String!
    role: Role!
    orders: [Order!]!
    shift: [Shift!]!
    createdAt: String!
    updatedAt: String!
  }

  type Shift {
    id: ID!
    shiftType: ShiftType!
    shiftIn: String!
    shiftOut: String
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: Int!
    name: String!
    variants: [ProductVariant!]!
    categoryId: Int
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  type ProductVariant {
    id: Int!
    size: Size!
    price: Float
    productId: Int!
    product: Product!
    orders: [OrderItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: Int!
    name: String!
    products: [Product!]!
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: Int!
    items: [OrderItem!]!
    total: Float!
    status: STATUS!
    userId: String!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    id: Int!
    quantity: Int!
    subtotal: Float!
    order: Order!
    productVariantId: Int!
    productVariant: ProductVariant!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getAllUsers: [User!]!
    getUser(id: String!): User
    getAllProducts: [Product!]!
    getProduct(name: String): Product
    getAllOrders: [Order!]!
    getOrder(id: Int!): Order
    getCategory(name: String!): Category
    getAllCategories: [Category!]!
    getProductVariant(data: SearchProductVariantInput!): ProductVariant
  }

  type Mutation {
    createUser(data: CreateUserInput!): User
    createCategory(data: CreateCategoryInput!): Category
    createProduct(data: CreateProductInput!): Product
    createOrder(data: CreateOrderInput!): Order

    deleteUser(id: String!): User
    deleteProduct(id: Int!): Product
    deleteCategory(name: String!): Category
    # deleteAllOrder: [Order!]!

    updateProduct(name: String!): Product
    updateOrderStatus(data: UpdateOrderStatusInput!): Order
  }

  #Products related mutations ------------------------------------------------------------------
  input CreateProductVariantInput {
    size: Size!
    price: Float!
  }

  input EditProductInput {
    name: String #Optional vice versa to variants
    variants: [CreateProductVariantInput!] #Optional if we only want to update the name
  }

  input SearchProductVariantInput {
    productId: Int!
    size: Size!
  }

  input CreateCategoryInput {
    name: String!
  }

  input CreateProductInput {
    name: String!
    variants: [CreateProductVariantInput!]!
    categoryId: Int!
  }

  #ORDERS RELATED MUTATIONS -------------------------------------------------------------------
  input CreateOrderInput {
    items: [CreateOrderItemInput!]!
    total: Float!
    status: STATUS!
    userId: String!
  }
  input CreateOrderItemInput {
    productVariantId: Int!
    quantity: Int!
    subtotal: Float!
  }
  input UpdateOrderStatusInput {
    id: Int!
    status: STATUS!
  }

  #Users related mutations ---------------------------------------------------------------------
  input CreateUserInput {
    firstname: String!
    middlename: String!
    lastname: String!
    age: Int!
    email: String!
    password: String!
    role: Role!
  }
`;
