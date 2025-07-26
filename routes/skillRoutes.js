import express from 'express';
const router = express.Router();

import { addSkill, deleteSkill, skills, updateSkill } from '../controllers/skillController.js';
import upload from '../middlewares/upload.js'

router.post('/', upload.single('image'), addSkill);
router.get('/', skills);
router.put('/:id', upload.single('image'), updateSkill);
router.delete('/:id', deleteSkill);

export default router;