import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
   
   // const createProductData = await prisma.category.create({data: {
   //    name: "WEAK",
   //    products: {
   //       create: {
   //          name: "Nescafe",
   //          variants: {
   //             create: [
   //                {size: "Small", price: 39},
   //                {size: "Medium", price: 49},
   //                {size: "Large", price: 59}
   //             ]
   //          }
   //       }
   //    }
      
   // },include: {
   //    products: {
   //       include:{
   //          variants: {
   //             select: {
   //                size: true,
   //                price: true
   //             }
   //          }
   //       }
   //    }
   // }})
   
   

   // console.log(createProductData)

}

main()
 .catch(error => {
    console.error(error.message)
 })
 .then(async () => {
    prisma.$disconnect()
 })