import request from 'supertest'
import express from 'express'
import {faker} from '@faker-js/faker'
import catalogRoutes , { catalogService } from '../catalog.routes'
import { ProductFactory } from '../../utils/fixtures'

const app = express()
app.use(express.json())
app.use(catalogRoutes)

const mockRequest = ()=>{
    return {
    stock: faker.number.int({min:10,max:100}),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price()
}}

describe("Catalog Routes",()=>{
    describe("POST /product",()=>{
      test("should create product successfully", async () => {
        const requestBody = mockRequest();
        
        const product = ProductFactory.build();
        jest
          .spyOn(catalogService, "createProduct")
          .mockImplementationOnce(() => Promise.resolve(product));
        const response = await request(app)
          .post("/product")
          .send(requestBody)
          .set("Accept", "application/json");
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(product);
      });
      test("should respond with validation error 400", async () => {
        const requestBody = mockRequest();
  
        const response = await request(app)
          .post("/product")
          .send({ ...requestBody, name: "" })
          .set("Accept", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual("name should not be empty");
      });
       test("should respond with an internal error code 500", async () => {
        const requestBody = mockRequest();
        
        const product = ProductFactory.build();
        jest
          .spyOn(catalogService, "createProduct")
          .mockImplementationOnce(() => Promise.reject(new Error("unable to create product")));
        const response = await request(app)
          .post("/product")
          .send(requestBody)
          .set("Accept", "application/json");
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual("unable to create product");
      });
    })
    describe("PATCH /product/:id",()=>{
      test("should update product successfully", async () => {
        
        const product = ProductFactory.build();
        const requestBody = {
          name :product.name,
          price: product.price,
          stock:product.stock
        };
        jest
          .spyOn(catalogService, "updateProduct")
          .mockImplementationOnce(() => Promise.resolve(product));
        const response = await request(app)
          .patch(`/product/${product.id}`)
          .send(requestBody)
          .set("Accept", "application/json");
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(product);
      });

      test("should respond with validation error 404", async () => {
        const product = ProductFactory.build();
        const requestBody = {
          name :product.name,
          price: -1,              //simulate validation error using incorrect price
          stock:product.stock
        };
  
        const response = await request(app)
          .patch(`/product/${product.id}`)
          .send(requestBody)
          .set("Accept", "application/json");

        expect(response.status).toBe(400);
        expect(response.body).toEqual("price must not be less than 1");
      });

       test.only("should respond with an internal error code 500", async () => {
        const requestBody = mockRequest();
        
        const product = ProductFactory.build();
        jest
          .spyOn(catalogService, "updateProduct")
          .mockImplementationOnce(() => Promise.reject(new Error("unable to update product")));
        const response = await request(app)
          .patch(`/product/${product.id}`)
          .send(requestBody)
          .set("Accept", "application/json");
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual("unable to update product");
      });
    })

})