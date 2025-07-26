import express from 'express'
const router = express.Router()

import upload from '../middlewares/upload.js'
import { protect } from '../middlewares/authMiddleware.js'

import { addProject, project, projects, deleteProject, updateProject } from '../controllers/projectController.js'

router.post('/', upload.single('thumbnail'), addProject);
router.get("/", projects)
router.get("/:id", project)
router.put('/:id', (req, res, next) => {
  upload.single('thumbnail')(req, res, function (err) {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, updateProject);
router.delete('/:id', deleteProject)



export default router