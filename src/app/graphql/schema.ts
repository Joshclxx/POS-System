import { gql } from "@apollo/client";

export const typeDefs = gql`
  enum Role {
    cashier
    manager
    admin
  }

  enum Gender{
    male
    female
  }

  enum ShiftType {
    opening
    closing
  }

  enum STATUS {
    queue
    completed
    voided
  }

  enum Size {
    pt
    rg
    gr
  }

  enum Type {
    dine_in
    take_out
  }


  type User {
    id: ID!
    firstname: String!
    middlename: String!
    lastname: String!
    suffix: String!
    gender: Gender!
    email: String!
    password: String!
    role: Role!
    loginHistory: [LoginHistory!]!
    orders: [Order!]!
    shift: [Shift!]!
    spotCheck: [SpotCheck!]!
    createdAt: String!
    updatedAt: String!
  }

  type LoginHistory {
    id: Int!
    userId: ID!
    loggedInAt: String!
    timeIn: String!
    timeOut: String
  }

  type Shift {
    id: Int!
    shiftType: ShiftType!
    loginHistoryId: Int!
    startingCash: Float!
    cashpickAmount: Float
    voidedAmount: Float
    totalSales: Float
    userId: String!
  }

  type SpotCheck {
    id: Int!
    userId: String!
    user: User
    currentCash: Float!
    actualCash: Float!
    createdAt: String!
    
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
    type: Type!
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
    productName: String!
    productSize: Size!
    productPrice: Float!
    createdAt: String!
    updatedAt: String!
  }

  type VoidOrder {
    id: Int!
    orderId: Int!
    shiftId: Int!
    userId: String!
    createdAt: String!
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
    getSpotCheckHistory: [SpotCheck!]!
    getAllUserShift: [Shift!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User
    createCategory(data: CreateCategoryInput!): Category
    createProduct(data: CreateProductInput!): Product
    createOrder(data: CreateOrderInput!): Order
    createVoidOrder(data: CreateVoidOrderInput!): VoidOrder
    loginAndRecord(data: loginAndRecordInput!): LoginResponse
    createUserShift(data: UserShiftInput!): Shift
    createSpotCheck(data: SpotCheckInput!): SpotCheck

    deleteUser(id: String!): User
    deleteProduct(id: Int!): Product
    deleteCategory(name: String!): Category
    # deleteAllOrder: [Order!]!

    updateProduct(id: Int!, edits: EditProductInput!): Product
    updateCategory(id: Int!, name: String!): Category
    updateOrderStatus(data: UpdateOrderStatusInput!): Order
    updateUser(id: String!, edits: EditUserInput!) : User
    updateLoginRecord(userId: String!): LoginHistory
    updateUserShift(data: UpdateUserShiftInput!): Shift
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
    type: Type!
    userId: String!
  }
  input CreateOrderItemInput {
    productName: String!
    productSize: Size!
    productPrice: Float!
    quantity: Int!
    subtotal: Float!
  }
  input UpdateOrderStatusInput {
    id: Int!
    status: STATUS!
  }

  input CreateVoidOrderInput {
    orderId: Int!
    shiftId: Int!
    userId: String!
  }

  #Users related mutations ---------------------------------------------------------------------
  input CreateUserInput {
    firstname: String!
    middlename: String!
    lastname: String!
    suffix: String
    gender: Gender!
    email: String!
    password: String!
    role: Role!
  }

  input loginAndRecordInput {
    email: String!
    password: String!
    loggedInAt: String!
  }

  input EditUserInput {
    firstname: String
    middlename: String
    lastname: String
    suffix: String
    gender: Gender
    email: String
    password: String
    role: Role
  }

  input UserShiftInput {
    loginHistoryId: Int!
    startingCash: Float!
    userId: String!
  }

  input UpdateUserShiftInput {
    loginHistoryId: Int!
    cashpickAmount: Float!
    voidedAmount: Float!
    totalSales: Float!
  }

  input SpotCheckInput {
    userId: String!
    currentCash: Float!
    actualCash: Float!
  }

  #Custom ------------------------------------------------------------------------------------
  type LoginResponse {
    id: ID!
    role: Role!
    sessionId: Int!
  }
`;
