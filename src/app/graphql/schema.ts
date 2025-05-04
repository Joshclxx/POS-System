import { gql } from "apollo-server-micro";

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
    shift: [shift!]!
    createdAt: String!
    updatedAt: String!
}

type Shift {
    id: ID!
    shiftType: ShiftType!
    shiftIn: String!
    shiftOut: String!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Product {
    id: ID!
    name: String!
    variants: [ProductVariant!]!
    category: Category!
    createdAt: String!
    updatedAt: String!
}

type ProductVariant {
    id: ID!
    size: String!
    price: Float!
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
    users: [User!]!
    user(id: String!) : User
    products: [Product!]!
    product(id: Int!) : Product
    productVariants: [ProductVariant!]!
    categories: [Category!]!
    orders: [Order!]!
    shifts: [Shift!]!
    orderItems: [OrderItem!]!
}

type Mutation {
    createUser(
        firstname: String!
        middlename: String!
        lastname: String!
        age: Int!
        email: String!
        password: String!
        role: Role!
    ): User

    deleteUser(id: String!): User
    deleteProduct(id: Int!): Product
    deleteCategory(id: Int!): Category
}
`;