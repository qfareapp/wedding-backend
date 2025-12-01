import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const admin = await Admin.create({
      email: req.body.email,
      passwordHash: hash,
    });

    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isValid = await bcrypt.compare(req.body.password, admin.passwordHash);
    if (!isValid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
