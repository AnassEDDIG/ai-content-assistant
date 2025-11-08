import Tone from "../models/Tone.mjs";

export async function getAllTones(req, res) {
  try {
    const tones = await Tone.find().sort("name");
    res.json({ status: "success", data: tones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Failed to fetch tones" });
  }
}

export async function createTone(req, res) {
  try {
    const { name } = req.body;
    const existing = await Tone.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ status: "fail", message: "Tone already exists" });
    }

    const tone = new Tone({ name: name.trim() });
    await tone.save();
    res.status(201).json({ status: "success", data: tone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Failed to create tone" });
  }
}

export async function deleteTone(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Tone.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", message: "Tone not found" });
    }

    res.json({ status: "success", message: "Tone deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Failed to delete tone" });
  }
}
