import { Router } from "express";
import multer from "multer";

import { CreateUserController } from "./controllers/user/CreateUserControllers";
import { AuthUserController } from "./controllers/user/AuthUserControllers";
import { DetailUserController } from "./controllers/user/DetailUserControllers";

import { CreateCategoryController } from "./controllers/category/CreateCategoryControllers";
import { ListCategoryController } from "./controllers/category/ListCategoryController";

import { CreateProductController } from "./controllers/products/CreateProductController";
import { ListByCategoryController } from "./controllers/products/ListByCategoryController";


import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { RemoveOrderController } from "./controllers/order/RemoveOrderController";

import { AddItemController } from "./controllers/order/AddItemController";


import { isAuthenticated } from "./middlewares/user/isAuthenticated";

import uploadConfig from './config/multer'
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { ListOrderController } from "./controllers/order/ListOrderController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";


const router = Router();

const upload = multer(uploadConfig.upload("./tmp"))

//Rotas USER

router.post('/users', new CreateUserController().handle)
    
router.post('/session', new AuthUserController().handle)

router.get('/me', isAuthenticated, new DetailUserController().handle)

// -- ROTAS CATEGORY --

router.post('/category', isAuthenticated, new CreateCategoryController().handle)

router.get('/category', isAuthenticated, new ListCategoryController().handle)


 // -- ROTAS DE PRODUCT

router.post('/product', isAuthenticated, upload.single('file'), new CreateProductController().handle)

router.get('/category/product', isAuthenticated, new ListByCategoryController().handle)

// -- ROTAS DE ORDER

router.post('/order', isAuthenticated, new CreateOrderController().handle)

router.delete('/order', isAuthenticated, new RemoveOrderController().handle)

// -- ADD ITEM

router.post('/order/add', isAuthenticated, new AddItemController().handle)

router.delete('/order/remove', isAuthenticated, new RemoveItemController().handle)

router.put('/order/send' , isAuthenticated, new SendOrderController().handle)

router.get('/orders', isAuthenticated, new ListOrderController().handle)

router.get('/order/detail', isAuthenticated, new DetailOrderController().handle)

router.put('/order/finish' , isAuthenticated, new FinishOrderController().handle)


export { router };

