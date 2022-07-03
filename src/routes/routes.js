import { Router } from "express";
import { createFakeProducts } from "../DB/controllers/createFakeProducts.js";

const routerProducto = Router();

routerProducto.get("/productos-test", async (req, res) => {

    const products = await createFakeProducts();
    
    if (products.length > 0) res.status(200).json(products);
    else res.status(404).send({ message: "Productos no encontrado" });
});

export default routerProducto;