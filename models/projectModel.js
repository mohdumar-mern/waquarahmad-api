import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      trim: true,
    },
    softwares: {
      type: [String],
      required: [true, 'Tech stack is required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Tech stack must include at least one technology',
      },
    },
    ytlink: {
      type: String,
     
    },


    thumbnail: {
      url: String,
      public_id: String,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },


  },
  { timestamps: true }
);

// Add pagination plugin
projectSchema.plugin(mongoosePaginate);

// Export model
const Project = mongoose.model('Project', projectSchema);
export default Project;
