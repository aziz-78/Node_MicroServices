import express ,{NextFunction, Request,Response }from 'express'
import { CatalogService } from '../services/catalog.service'
import { CatalogRepository } from '../repository/catalog.repository'
import { RequestValidator } from '../utils/requestValidator'
import { CreateProductRequest, UpdateProductRequest } from '../dto/product.dto'
import { log } from 'node:console'

const router = express.Router()

export const catalogService = new CatalogService(new CatalogRepository())
router.get('/',async(req:Request,res:Response)=>{
    return res.status(200).json({
        msg:"catalog service running"
    })
})
router.post('/product',async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        CreateProductRequest,
        req.body
      );

      if (errors) return res.status(400).json(errors);
      const data = await catalogService.createProduct(input);
      return res.status(201).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);
router.patch('/product/:id',async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        UpdateProductRequest,
        req.body
      );

      const id = parseInt(req.params.id) || 0

      if (errors) return res.status(400).json(errors);
      const data = await catalogService.updateProduct({id,...input});
      return res.status(201).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

router.get(
  "/product",
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);
    try {
      const data = await catalogService.getProducts(limit, offset);
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

export default router