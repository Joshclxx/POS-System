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
    id: ID!,
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
    id: ID!
    name: String!
    variants: [ProductVariant!]!
    categoryId: Int!
    createdAt: String!
    updatedAt: String!
}

type ProductVariant {
    id: ID!
    size: Size!
    price: Float
    product: Product!
    orders: [OrderItem!]!
    createdAt: String!
    updatedAt: String!
}

type Category {
    id: ID!
    name: String!
    products: [Product!]!
    createdAt: String!
    updatedAt: String!
}

type Order {
    id: ID!
    items: [OrderItem!]!
    total: Float!
    status: STATUS!
    orderDate: String!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type OrderItem {
    id: ID!
    quantity: Int!
    subtotal: Float!
    order: Order!
    productVariant: ProductVariant!
    createdAt: String!
    updatedAt: String!
}

type Query {
    getAllUsers: [User!]!
    getUser(id: String!) : User
    getAllProducts: [Product!]!
    getProduct(name: String) : Product
    getAllOrders: [Order!]!
    getOrder(id: Int!): Order
    getCategory(name: String!): Category
}

type Mutation {
    createUser(data: CreateUserInput!): User
    createCategory(data: CreateCategoryInput!): Category
    createProduct(data: CreateProductInput!): Product

    deleteUser(id: String!): User
    deleteProduct(id: Int!): Product
    deleteCategory(id: ID!): Category

    updateProduct(id: Int!, edits: EditProductInput!): Product
}

input CreateProductVariantInput {
    size: Size!
    price: Float!
}

input EditProductInput {
    name: String
    variants: [CreateProductVariantInput!]
}

input CreateUserInput {
    firstname: String!
    middlename: String!
    lastname: String!
    age: Int!
    email: String!
    password: String!
    role: Role!
}

input CreateCategoryInput {
    name: String!
}

input CreateProductInput {
    name: String!
    variants: [CreateProductVariantInput!]!
    categoryId: Int!
}


`;