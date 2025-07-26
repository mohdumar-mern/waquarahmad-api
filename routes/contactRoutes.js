import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'

import { submitContact, contact, contacts, deleteContact } from '../controllers/contactController.js'

router.get("/",protect, contacts)
router.get("/:id",protect, contact)
router.post("/", submitContact)
router.delete('/:id', protect,deleteContact)


export default router