import { ICatalogRepository } from "../../interface/catalogRepository.interface"
import { MockCatalogRepository } from "../../repository/mockCatalog.repository"
import { CatalogService } from "../catalog.service";
import { faker } from '@faker-js/faker'
import { Product } from "../../models/product.model";
import { Factory } from 'rosie'
import { ProductFactory } from "../../utils/fixtures";

const mockProduct = (rest:any)=>{
    return {
    stock: faker.number.int({min:10,max:100}),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    ...rest
}}

describe('catalogService',()=>{
    let repository : ICatalogRepository;
    
    beforeEach(()=>{
        repository =  new MockCatalogRepository();
    })
    afterEach(()=>{
        repository = {} as MockCatalogRepository;
    })
    describe("createProduct",()=>{
        test("should create product",async()=>{
            const service = new CatalogService(repository)
            const data = mockProduct({price: +faker.commerce.price})
            const result = await service.createProduct(data)
            
            expect(result).toMatchObject({
                id:expect.any(Number),
                name:expect.any(String),
                stock:expect.any(Number),
                description:expect.any(String),
                price:expect.any(Number)
            })
        })

        test("should throw error with unable to create product",async()=>{
            const service = new CatalogService(repository)
            const data = mockProduct({ price: +faker.commerce.price })

            jest.spyOn(repository,"create").mockImplementation(()=>Promise.resolve({} as Product))
            await expect(service.createProduct(data)).rejects.toThrow(
                "unable to create product"
            )
        })
        test("should throw error with product already exists",async()=>{
            const service = new CatalogService(repository)
            const data = mockProduct({ price: +faker.commerce.price })

            jest.spyOn(repository,"create").mockImplementation(()=>Promise.reject(new Error("product already exists")))
            await expect(service.createProduct(data)).rejects.toThrow(
                "product already exists"
            )
        })
    })
    describe("updateProduct",()=>{
        test("should update product",async()=>{
            const service = new CatalogService(repository)
            const data = mockProduct({
                price: +faker.commerce.price,
                id:faker.number.int({min:10,max:1000})
            })
            const result = await service.updateProduct(data)
            
            expect(result).toMatchObject(data)
        })
        test("should throw error with product does not exist",async()=>{
            const service = new CatalogService(repository)

            jest.spyOn(repository,"update").mockImplementation(()=>Promise.reject(new Error("product does not exist")))
            await expect(service.updateProduct({})).rejects.toThrow(
                "product does not exist"
            )
        })
    })
    describe("getProducts",()=>{
        test("should get products by offset and limit",async()=>{
            const service = new CatalogService(repository)
            const randomLimit = faker.number.int({min:10,max:50})
            const products = ProductFactory.buildList(randomLimit)
            jest.spyOn(repository,"find").mockImplementationOnce(()=> Promise.resolve(products))
            const result = await service.getProducts(randomLimit,0)
            expect(result.length).toEqual(randomLimit)
            expect(result).toMatchObject(products)
        })
        test("should throw error with product does not exist",async()=>{
            const service = new CatalogService(repository)

            jest.spyOn(repository,"find").mockImplementation(()=>Promise.reject(new Error("product does not exist")))
            await expect(service.getProducts(0,0)).rejects.toThrow(
                "product does not exist"
            )
        })
    })

    describe("getProduct",()=>{
        test("should get product by id",async()=>{
            const service = new CatalogService(repository)
            const product = ProductFactory.build()
            jest.spyOn(repository,"findOne").mockImplementationOnce(()=> Promise.resolve(product))
            const result = await service.getProduct(product.id!)
            expect(result).toMatchObject(product)
        })
    })
    describe("deleteProduct",()=>{
        test("delete product by id",async()=>{
            const service = new CatalogService(repository)
            const product = ProductFactory.build()
            jest.spyOn(repository,"delete").mockImplementationOnce(()=> Promise.resolve({id:product.id}))
            const result = await service.deleteProduct(product.id!)
            expect(result).toMatchObject({
                id:product.id
            })
        })
    })
})