import { Router } from "express";
import {
  signup,
  search,
  registries,
  items,
  addItem,
  updateItem,
  removeItem,
  purchased,
} from "../controllers/myregistry.controller";

const router = Router();

router.post("/signup", signup);
router.get("/search", search);
router.get("/registries", registries);
router.get("/items", items);
router.post("/items/add", addItem);
router.post("/items/update", updateItem);
router.post("/items/remove", removeItem);
router.post("/items/purchased", purchased);

export default router;
