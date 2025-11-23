const courrierLuService = require("../services/courrierLu.service");


exports.markCourrierAsRead = async (req, res) => {
  try {
    const courrierId = req.params.id;
    const userId = req.user.id;

    const result = await courrierLuService.markAsRead({ courrierId, userId });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error marking courrier as read:", err);
    res.status(500).json({ message: "Server error", err });
  }
};


exports.getReadsForCourrier = async (req, res) => {
  try {
    const courrierId = req.params.id;
    const result = await courrierLuService.getAllReadsForCourrier(courrierId);
    res.json(result);
  } catch (err) {
    console.error("Error getting reads for courrier:", err);
    res.status(500).json({ message: "Server error", err });
  }
};
