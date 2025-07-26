import Contact from "../models/contactsModel.js";
import expressAsyncHandler from "express-async-handler";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Submit Contact
// @route   POST /api/contact
// @access  Public
export const submitContact = expressAsyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Name, email, and message are required." });
  }

  const subject = `New Contact Message from ${name}`;
  const text = `
You received a new message from your portfolio/contact form:

Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${message}
`;

  try {
    // Send confirmation or notification email
    await sendEmail(subject, text, email);

    // Save to DB
    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    if (!contact) {
      return res
        .status(500)
        .json({ message: "Failed to save contact in database." });
    }

    return res.status(201).json({
      message: "Message saved successfully and email sent.",
      ok: true,
    });
  } catch (err) {
    console.error("Email sending failed:", err.message);
    return res
      .status(500)
      .json({ message: "Something went wrong while processing your request." });
  }
});

// @desc    Get All Contacts (with pagination + search)
// @route   GET /api/contact
// @access  Public


export const contacts = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const skip = (currentPage - 1) * itemsPerPage;

  const query = {};

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ];
  }

  const [contacts, totalDocs] = await Promise.all([
    Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .lean(),
    Contact.countDocuments(query),
  ]);

  if (!contacts || contacts.length === 0) {
    return res.status(404).json({ message: "No contacts found." });
  }

  const totalPages = Math.ceil(totalDocs / itemsPerPage);

  res.status(200).json({
    data: contacts,
    pagination: {
      totalDocs,
      limit: itemsPerPage,
      totalPages,
      currentPage,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    },
  });
});


// @desc    Get Single Contact
// @route   GET /api/contact/:id
// @access  Public
export const contact = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id).lean();
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  return res.status(200).json(contact);
});

// @desc    Delete Contact
// @route   DELETE /api/contact/:id
// @access  Public
export const deleteContact = expressAsyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  return res.status(200).json({ message: "Contact deleted successfully" });
});
