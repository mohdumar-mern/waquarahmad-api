import express from 'express'

import upload from '../middlewares/upload.js'
import { protect } from '../middlewares/authMiddleware.js'
import {  getProfile, getProfilePic, getResume, getSocialLinks, updateProfile } from '../controllers/profileController.js'

const router = express.Router()

// POST /api/profile
router.get('/', getProfile)
router.get('/pic', getProfilePic)
router.get('/resume', getResume)
router.get('/social-links', getSocialLinks)
// router.post(
//   '/',
//   protect,
//   upload.fields([
//     { name: 'profilepic', maxCount: 1 },
//     { name: 'resume', maxCount: 1 },
//   ]),
//   createProfile
// )

router.put(
  '/',
  protect,
  upload.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  updateProfile
)

export default router
