const axios = require("axios");
const pdfParse = require("pdf-parse");

exports.fetchPdfBuffer = async (pdfUrl) => {
  const res = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
  });
  return Buffer.from(res.data);
};

exports.extractPdfText = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};