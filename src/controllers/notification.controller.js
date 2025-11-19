const notificationService = require("../services/notification.service");

/**
 * GET /api/notifications/my
 * Récupère les notifications de l'utilisateur connecté
 */
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user && (req.user.userId || req.user.id);
    if (!userId) return res.status(401).json({ message: "Utilisateur non identifié" });

    const notifications = await notificationService.getByUser(userId);
    res.json(notifications);
  } catch (err) {
    console.error("getMyNotifications error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Marque la notification :id comme lue (pour l'utilisateur connecté)
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user && (req.user.userId || req.user.id);
    if (!userId) return res.status(401).json({ message: "Utilisateur non identifié" });

    const notifId = req.params.id;
    const ok = await notificationService.markAsRead(notifId, userId);

    if (!ok) return res.status(404).json({ message: "Notification introuvable" });

    res.json({ message: "Notification marquée comme lue" });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * GET /api/notifications/unread-count
 * Retourne le nombre de notifications non lues de l'utilisateur connecté
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user && (req.user.userId || req.user.id);
    if (!userId) return res.status(401).json({ message: "Utilisateur non identifié" });

    const count = await notificationService.countUnread(userId);
    res.json({ unread: count });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
