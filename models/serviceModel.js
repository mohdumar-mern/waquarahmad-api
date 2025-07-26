import mongoose from "mongoose";


const serviceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { url: String, public_id: String },
        // softwares: {
        //     type: [String],
        //     required: [true, 'Tech stack is required'],
        //     validate: {
        //         validator: (arr) => Array.isArray(arr) && arr.length > 0,
        //         message: 'Tech stack must include at least one technology',
        //     },
        // },
  status: {
        type: Boolean,
        default: false,
    },
    },
    { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service