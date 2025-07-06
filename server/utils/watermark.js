const { PDFDocument, rgb } = require('pdf-lib');

class DocumentWatermark {
  static async addWatermark(pdfBuffer, text) {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont('Helvetica');

    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - 150,
        y: height / 2,
        size: 60,
        font,
        color: rgb(0.9, 0.9, 0.9),
        opacity: 0.3,
        rotate: Math.PI / 4,
      });
    });

    return await pdfDoc.save();
  }
}

module.exports = DocumentWatermark; 