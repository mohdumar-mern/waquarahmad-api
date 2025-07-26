import expressAsyncHandler from 'express-async-handler'
import Profile from '../models/profileModel.js'
import https from 'https'


// GET: /api/contacts/ (Get full profile)
export const getProfile = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.adminId }).populate('userId', 'username')
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' })
  }
  res.json(profile)
})

// POST: /api/contacts/ (Create new profile)
// export const createProfile = expressAsyncHandler(async (req, res) => {
//   const { username, linkedin, twitter, instagram, youtube } = req.body
//   const files = req.files || {}
//   const profilepic = files.profilepic?.[0]
//   const resume = files.resume?.[0]

//   if (!username || !linkedin || !twitter || !instagram || !youtube || !profilepic || !resume) {
//     return res.status(400).json({ message: 'All fields and files are required' })
//   }

//   const profile = await Profile.create({
//     userId: req.adminId,
//     username,
//     profilepic: {
//       url: profilepic.path,
//       public_id: profilepic.filename,
//     },
//     resume: {
//       url: resume.path,
//       public_id: resume.filename,
//     },
//     socialLinks: { linkedin, twitter, instagram, youtube },
//   })

//   if (!profile) {
//     return res.status(500).json({ message: 'Profile creation failed' })
//   }

//   res.status(201).json({ message: 'Profile created successfully', profile })
// })

// PUT: /api/contacts/ (Update or create profile)


export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { username, linkedin, twitter, instagram, youtube } = req.body;
  const files = req.files || {};
  const profilepic = files.profilepic?.[0];
  const resume = files.resume?.[0];

  const existingProfile = await Profile.findOne({ userId: req.adminId });

  const isProfilePicMissing = !profilepic && !existingProfile?.profilepic?.url;
  const isResumeMissing = !resume && !existingProfile?.resume?.url;

  if (isProfilePicMissing) {
    return res.status(400).json({ message: 'Profile picture is required' });
  }

  if (isResumeMissing) {
    return res.status(400).json({ message: 'Resume is required' });
  }

  const updatedProfileData = {
    userId: req.adminId,
    username,
    socialLinks: {
      linkedin,
      twitter,
      instagram,
      youtube,
    },
    profilepic: profilepic
      ? {
          url: profilepic.path,
          public_id: profilepic.filename,
        }
      : existingProfile?.profilepic,
    resume: resume
      ? {
          url: resume.path,
          public_id: resume.filename,
        }
      : existingProfile?.resume,
  };

  const savedProfile = existingProfile
    ? await Profile.findByIdAndUpdate(existingProfile._id, updatedProfileData, { new: true })
    : await Profile.create(updatedProfileData);

  res.status(existingProfile ? 200 : 201).json({
    message: `Profile ${existingProfile ? 'updated' : 'created'} successfully`,
    profile: savedProfile,
  });
});

// GET: /api/contacts/profilepic
export const getProfilePic = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.adminId })
  if (!profile?.profilepic) {
    return res.status(404).json({ message: 'Profile picture not found' })
  }
  res.json(profile.profilepic)
})

// PATCH: /api/contacts/profilepic
export const updateProfilePic = expressAsyncHandler(async (req, res) => {
  const { profilepic } = req.files || {}
  if (!profilepic?.[0]) {
    return res.status(400).json({ message: 'Profile picture is required' })
  }

  const profile = await Profile.findOne({ userId: req.adminId })
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' })
  }

  profile.profilepic = {
    url: profilepic[0].path,
    public_id: profilepic[0].filename,
  }

  await profile.save()
  res.json({ message: 'Profile picture updated successfully' })
})

// GET: /api/contacts/resume

// Download resume with custom filename
export const getResume = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.adminId });

  if (!profile?.resume?.url) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  const fileUrl = profile.resume.url;

  // Set headers to view in browser (not download)
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="Waquar-Ahmad-3D-Animator.pdf"');

  // Stream the file from Cloudinary to client
  https.get(fileUrl, fileRes => {
    fileRes.pipe(res);
  }).on('error', err => {
    console.error('Error streaming resume:', err.message);
    res.status(500).json({ message: 'Failed to load resume' });
  });
});




// GET: /api/contacts/social-links
export const getSocialLinks = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.adminId })
  if (!profile?.socialLinks) {
    return res.status(404).json({ message: 'Social links not found' })
  }
  res.json(profile.socialLinks)
})

