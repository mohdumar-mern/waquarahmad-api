import mongoose from 'mongoose';

export const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    profilepic:{

        url: String,
        public_id: String
    },
    username: {
        type: String,
        required: true
    },
    resume: {
        url: String,
        public_id: String
    },
        socialLinks: {
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },

},{
    timestamps: true,

})

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;