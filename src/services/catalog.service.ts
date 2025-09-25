import { ICatalogRepository } from "../interface/catalogRepository.interface";

export class CatalogService{
    private _repository: ICatalogRepository;
    constructor(repository:ICatalogRepository){
        this._repository = repository
    }
    async createProduct(input:any){
        const data = await this._repository.create(input)
        if(!data.id){
            throw new Error("unable to create product")
        }
        return data
    };
    async updateProduct(input:any){
        const data = await this._repository.update(input)
        return data
    };
    async getProducts(limit:number,offset:number){
        const data = await this._repository.find(limit,offset)
        return data
    };
    async getProduct(id:number){
        const data = await this._repository.findOne(id)
        return data
    };
    async deleteProduct(id:number){
        const response = await this._repository.delete(id)
        return response
    };
}