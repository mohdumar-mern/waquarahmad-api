import expressAsyncHandler from 'express-async-handler'
import Service from '../models/serviceModel.js'

// @desc   Add Single Service
// @route  POST /api/services/add
// @access Public
export const addService = expressAsyncHandler(async (req, res) => {
  const { title, description, featured } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: "No service image uploaded" });
  }

  const fileUrl = req.file.path || req.file.url;
  const public_id = req.file.public_id || req.file.filename || null;

  const service = await Service.create({
    title,
    description,
    status: featured,
    image: { url: fileUrl, public_id },
  });

  if (!service) {
    return res.status(500).json({ message: "Failed to save service" });
  }

  res.status(201).json({ message: "Successfully added service", service });
});

// @desc   Get all Services
// @route  GET /api/services
// @access Public
export const services = expressAsyncHandler(async (req, res) => {
  const services = await Service.find().sort({updatedAt: -1}).lean();
  if (!services || services.length === 0) {
    return res.status(404).json({ message: "No services found" });
  }

  res.status(200).json(services);
});

// @desc   Get Single Service by ID
// @route  GET /api/services/:id/view
// @access Public
export const service = expressAsyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).lean();
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.status(200).json(service);
});

// @desc   Update Service
// @route  PUT /api/services/:id/edit
// @access Public
export const updateService = expressAsyncHandler(async (req, res) => {
  const { title, description, featured } = req.body;

  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  let fileUrl = service.image?.url || "";
  let public_id = service.image?.public_id || "";

  if (req.file) {
    fileUrl = req.file.path || req.file.url || fileUrl;
    public_id = req.file.public_id || req.file.filename || public_id;
  }

  service.title = title || service.title;
  service.description = description || service.description;
  service.status = featured || service.featured;
  service.image = { url: fileUrl, public_id };

  const updatedService = await service.save();

  res.status(200).json({ message: "Service updated successfully", service: updatedService });
});

// @desc   Delete Service
// @route  DELETE /api/services/:id
// @access Public
export const deleteService = expressAsyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id).lean();
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.status(200).json({ message: `Service deleted successfully ${service._id}`,});
});
