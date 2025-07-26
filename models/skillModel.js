import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a skill title"],
    },
    description: {
        type: String,
        required: [true, "Please add a skill description"],
    },
    image: {
        url: String,
        public_id: String
    },
    featured: {
        type: Boolean,
        default: false,
    },

},
    {
        timestamps: true,
    });

    const Skill = mongoose.model("Skill", skillSchema);
    export default Skill;