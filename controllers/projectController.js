import expressAsyncHandler from "express-async-handler";
import Project from "../models/projectModel.js";

// ✅ @desc: Add a new project
// ✅ @route: POST /api/projects
export const addProject = expressAsyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No form data received" });
  }

  const { title, description, softwares, ytlink, featured } = req.body;
  const thumbnail = req.file;

  // Validate
  if (!title || !description || !softwares || softwares.length === 0) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!thumbnail) {
    return res.status(400).json({ message: "Thumbnail is required" });
  }
  
  // Save project
  const project = await Project.create({
    title,
    description,
    softwares: Array.isArray(softwares) ? softwares : [softwares],
    featured: featured === "true",
    ytlink,
    thumbnail: {
      public_id: thumbnail.filename,
      url: thumbnail.path,
    },
  });

  if (!project) {
    return res.status(500).json({ message: "Project creation failed" });
  }

  res.status(201).json({
    message: "Project added successfully",
    project,
  });
});


// ✅ @desc: Get all projects with pagination + search
// ✅ @route: GET /api/projects
export const projects = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", featured = "" } = req.query;

  const query = {};

  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }];
  }

  if (featured !== "") {
    query.featured = featured === "true";
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { updatedAt: -1 },
    lean: true,
  };

  const result = await Project.paginate(query, options);

  if (!result.docs.length) {
    return res.status(404).json({ message: "No projects found" });
  }

  res.status(200).json({
    data: result.docs,
    pagination: {
      totalDocs: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    },
  });
});

// ✅ @desc: Get single project by ID
// ✅ @route: GET /api/projects/:id
export const project = expressAsyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).lean();
  if (!project) {
    return res.status(404).json({ message: `Project not found with ID: ${req.params.id}` });
  }
  res.status(200).json(project);
});


// ✅ @desc: Update existing project
// ✅ @route: PUT /api/projects/:id
export const updateProject = expressAsyncHandler(async (req, res) => {
  const { title, description, softwares, ytlink, featured } = req.body;
  const thumbnail = req.file;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: `Project not found with ID: ${req.params.id}` });
  }

  // Update values
  project.title = title || project.title;
  project.description = description || project.description;
  project.softwares = Array.isArray(softwares) ? softwares : (softwares || project.softwares);
  project.ytlink = ytlink || project.ytlink;
  project.featured = featured === "true" || project.featured;

  if (thumbnail) {
    project.thumbnail = {
      public_id: thumbnail.filename,
      url: thumbnail.path,
    };
  }

  const updatedProject = await project.save();

  res.status(200).json({
    message: `Project updated successfully`,
    updatedProject,
  });
});


// ✅ @desc: Delete a project by ID
// ✅ @route: DELETE /api/projects/:id
export const deleteProject = expressAsyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ message: `Project not found with ID: ${req.params.id}` });
  }

  res.status(200).json({ message: `Project deleted successfully` });
});
