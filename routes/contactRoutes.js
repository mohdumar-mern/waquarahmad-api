import express from 'express'
const router = express.Router()

import { submitContact, contact, contacts, deleteContact } from '../controllers/contactController.js'

router.get("/", contacts)
router.get("/:id", contact)
router.post("/", submitContact)
router.delete('/:id', deleteContact)


export default router