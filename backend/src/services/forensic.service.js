const sharp = require("sharp");
const exifParser = require("exif-parser");

exports.extractExif = (buffer) => {
  try {
    const parser = exifParser.create(buffer);
    return parser.parse().tags;
  } catch {
    return null;
  }
};

exports.basicAiHeuristics = async (buffer) => {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const flags = [];

  if (!metadata.exif) {
    flags.push("NO_EXIF_DATA");
  }

  if (metadata.width % 64 === 0 && metadata.height % 64 === 0) {
    flags.push("AI_DIMENSION_PATTERN");
  }

  return flags;
};
