import Type from "../models/Type.mjs";

export async function getAllTypes(req, res) {
  try {
    const types = await Type.find().sort("name");
    res.json({ status: "success", data: types });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Failed to fetch types" });
  }
}

export async function createType(req, res) {
  try {
    const { name } = req.body;
    const existing = await Type.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ status: "fail", message: "Type already exists" });
    }

    const type = new Type({ name: name.trim() });
    await type.save();
    res.status(201).json({ status: "success", data: type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Failed to create type" });
  }
}

export async function deleteType(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Type.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", message: "Type not found" });
    }

    res.json({ status: "success", message: "Type deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Failed to delete type" });
  }
}
