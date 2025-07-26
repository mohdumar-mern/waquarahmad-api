import expressAsyncHandler from "express-async-handler";
import Skill from "../models/skillModel.js";

// @desc   Add Single Skill
// @route  POST /api/skills/add
// @access Public
export const addSkill = expressAsyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: "No skill image uploaded" });
  }

  const fileUrl = req.file.path || req.file.url;
  const public_id = req.file.public_id || req.file.filename || null;

  const skill = await Skill.create({
    title,
    description,
    image: { url: fileUrl, public_id },
  });

  if (!skill) {
    return res.status(500).json({ message: "Failed to save skill" });
  }

  res.status(201).json({ message: "Skill added successfully", skill });
});

// @desc   Get all Skills
// @route  GET /api/skills
// @access Public
export const skills = expressAsyncHandler(async (req, res) => {
  const allSkills = await Skill.find({}).sort({ updatedAt: -1 }).lean();

  if (!allSkills.length) {
    return res.status(404).json({ message: "No skills found" });
  }

  res.status(200).json(allSkills);
});

// @desc   Update Skill
// @route  PUT /api/skills/:id
// @access Private
export const updateSkill = expressAsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const existingSkill = await Skill.findById(id);
  if (!existingSkill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  const fileUrl = req.file?.path || req.file?.url || existingSkill.image.url;
  const public_id = req.file?.public_id || req.file?.filename || existingSkill.image.public_id;

  const updatedSkill = await Skill.findByIdAndUpdate(
    id,
    {
      title,
      description,
      image: { url: fileUrl, public_id },
    },
    { new: true }
  );

  if (!updatedSkill) {
    return res.status(500).json({ message: "Failed to update skill" });
  }

  res.status(200).json({ message: "Skill updated successfully", skill: updatedSkill });
});

// @desc   Delete Skill
// @route  DELETE /api/skills/:id
// @access Private
export const deleteSkill = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const skill = await Skill.findById(id);

  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  const deletedSkill = await Skill.findByIdAndDelete(id);
  if (!deletedSkill) {
    return res.status(500).json({ message: "Failed to delete skill" });
  }

  res.status(200).json({ message: `kill deleted successfully${deletedSkill._id}` });
});
