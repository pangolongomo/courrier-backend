const crypto = require("crypto");

exports.generateFileName = (originalName, prefix = "courriers") => {
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${prefix}/${crypto.randomUUID()}-${sanitized}`;
};
