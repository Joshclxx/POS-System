import {PrismaClient} from '@prisma/client'
import { create } from 'domain'
const prisma = new PrismaClient()

async function main(){
    // to create
    //const user = await prisma.user.create({data: {
    // }})
}

main()
 .catch(error => {
    console.error(error.message)
 })
 .then(async () => {
    prisma.$disconnect()
 })