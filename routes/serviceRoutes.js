import express from 'express'
const router = express.Router()

import { addService, service, services, updateService, deleteService } from '../controllers/serviceController.js'

import upload from '../middlewares/upload.js'
// import { protect } from '../middlewares/authMiddleware.js'

router.get('/', services)
router.get('/:id', service)
router.post('/',upload.single("image"),  addService)
router.put('/:id/', upload.single("image"), updateService)
router.delete('/:id', deleteService)

export default router