import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Product {
  id: number;
  model: string;
  code: string;
  power: string;
  flux: string;
  colorTemp: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  description: string;
  // Add other fields as necessary based on your product interface
}

export const generateExcel = async (products: Product[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Оферта");

  // Setup Columns
  worksheet.columns = [
    { header: "", key: "no", width: 5 },
    { header: "", key: "image", width: 15 },
    { header: "", key: "drawing", width: 15 },
    { header: "", key: "description", width: 50 },
    { header: "", key: "measure", width: 8 },
    { header: "", key: "qty", width: 8 },
    { header: "", key: "unitPrice", width: 12 },
    { header: "", key: "discountPrice", width: 12 },
    { header: "", key: "totalPrice", width: 12 },
  ];

  // --- Header Section ---
  // Add Logos
  // Note: In a real browser environment, we need to fetch the image as a buffer.
  // For this implementation, we'll try to fetch them from the public/logos directory.

  const fetchImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await blob.arrayBuffer();
    } catch (error) {
      console.error(`Failed to fetch image: ${url}`, error);
      return null;
    }
  };

  // Set row heights for logo rows (in points)
  // Convert 50px to points (1 point ≈ 1.33px, so 50px ≈ 37.5 points, round to 40 for spacing)
  worksheet.getRow(1).height = 80; // Row 1 (0-indexed: 0) - for 50px high logos
  worksheet.getRow(2).height = 80; // Row 2 (0-indexed: 1)
  worksheet.getRow(3).height = 25; // Row 3 (0-indexed: 2) - for contact info
  worksheet.getRow(4).height = 25; // Row 4 (0-indexed: 3)
  worksheet.getRow(5).height = 25; // Row 5 (0-indexed: 4)
  worksheet.getRow(6).height = 25; // Row 6 (0-indexed: 5)

  // Polaris Logo (Top Left, Columns A-B, Rows 1-2, spanning 2 rows)
  const polarisLogoBuffer =
    (await fetchImage("/polarisLogo.png")) ||
    (await fetchImage("/favicon.png"));
  if (polarisLogoBuffer) {
    const imageId = workbook.addImage({
      buffer: polarisLogoBuffer,
      extension: "png",
    });
    worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 180, height: 80 }, // Spans rows 1-2 (2 rows × 40 points)
    });
  }

  // Set column widths for logo columns
  worksheet.getColumn(4).width = 50; // Column E - expanded for Nowodvorski
  worksheet.getColumn(5).width = 50; // Column F
  worksheet.getColumn(6).width = 50; // Column G
  worksheet.getColumn(7).width = 50; // Column H

  // Partner Logos - 2-column grid pattern (all centered)
  // ExcelJS doesn't support direct offsetX/offsetY, so we'll use fractional column positions
  // Column width: 50 char units ≈ 350 pixels, Image width: 100px
  // To center: offset = (350 - 100) / 2 = 125px ≈ 17.86 char units
  // Fractional column position: col + (125 / 350) = col + 0.357
  const logoWidth = 100;
  const logoHeight = 50;
  const colWidth = 50; // Column width in character units
  const colWidthPx = colWidth * 7; // Convert to pixels
  const rowHeight = 80; // Row height in points
  const rowHeightPx = rowHeight * 1.33; // Convert to pixels

  // Calculate fractional offsets to center images
  const colOffset = (colWidthPx - logoWidth) / 2 / colWidthPx; // Fraction of column width
  const rowOffset = (rowHeightPx - logoHeight) / 2 / rowHeightPx; // Fraction of row height

  // Helper function to add centered logo
  const addCenteredLogo = async (
    imagePath: string,
    col: number,
    row: number,
    extension: "png" | "jpeg" | "jpg"
  ) => {
    const buffer = await fetchImage(imagePath);
    if (buffer) {
      const imageId = workbook.addImage({
        buffer: buffer,
        extension: extension === "jpg" ? "jpeg" : extension,
      });
      // Position image centered in cell using fractional positions
      worksheet.addImage(imageId, {
        tl: {
          col: col + colOffset,
          row: row + rowOffset,
        },
        ext: { width: logoWidth, height: logoHeight },
      });
    }
  };

  // D1: DeltaLight (centered)
  await addCenteredLogo("/logos/deltalightLogo.jpg", 3, 0, "jpg");

  // D2: Philips (centered)
  await addCenteredLogo("/logos/philipsLogo.png", 3, 1, "png");

  // E1: Nowodvorski (centered)
  await addCenteredLogo("/logos/nowodvorskiLogo.jpg", 4, 0, "jpg");

  // E2: Novaluce (centered)
  await addCenteredLogo("/logos/novaluceLogo.png", 4, 1, "png");

  // F1: Redo (centered)
  await addCenteredLogo("/logos/redoLogo.jpg", 5, 0, "jpg");

  // F2: ARELUX (centered)
  await addCenteredLogo("/logos/areluxLogo.jpg", 5, 1, "jpg");

  // G1: LEDS C4 (centered)
  await addCenteredLogo("/logos/ledsLogo.png", 6, 0, "png");

  // G2: ideal lux (centered)
  await addCenteredLogo("/logos/idealluxLogo.png", 6, 1, "png");

  // Company Info (Column C, Rows 3-6, individual cells, not merged)
  worksheet.getCell("C3").value = "Варна";
  worksheet.getCell("C3").alignment = { vertical: "top", horizontal: "left" };
  worksheet.getCell("C3").font = { size: 9 };

  worksheet.getCell("C4").value = "ул. Мургаш №5";
  worksheet.getCell("C4").alignment = { vertical: "top", horizontal: "left" };
  worksheet.getCell("C4").font = { size: 9 };

  worksheet.getCell("C5").value = "тел: 0889128161";
  worksheet.getCell("C5").alignment = { vertical: "top", horizontal: "left" };
  worksheet.getCell("C5").font = { size: 9 };

  worksheet.getCell("C6").value = "e-mail: k.borisov@polarislighting.bg";
  worksheet.getCell("C6").alignment = { vertical: "top", horizontal: "left" };
  worksheet.getCell("C6").font = { size: 9 };

  // Offer Title (Row 8, 0-indexed: row 7)
  worksheet.mergeCells("F8:M8");
  const titleCell = worksheet.getCell("F8");
  titleCell.value = "Оферта Севдана - къща - Поръчка 3"; // Dynamic title would go here
  titleCell.font = { bold: true, size: 14 };
  titleCell.alignment = { horizontal: "center" };

  // --- Table Header ---
  const headerRowIdx = 9; // Row 9 (0-indexed: row 8) - moved up one row since title is now at row 8
  const headerRow = worksheet.getRow(headerRowIdx);

  // Set header values
  headerRow.getCell(1).value = "№"; // Column A
  headerRow.getCell(2).value = "Снимка"; // Column B
  headerRow.getCell(3).value = "Чертеж"; // Column C
  headerRow.getCell(7).value = "Мярка"; // Column G
  headerRow.getCell(8).value = "Кол."; // Column H
  headerRow.getCell(9).value = "Ед. цена"; // Column I
  headerRow.getCell(10).value = "15% ТО"; // Column J

  // Merge cells for "Описание" (Columns D-F)
  worksheet.mergeCells(`D${headerRowIdx}:F${headerRowIdx}`);
  headerRow.getCell(4).value = "Описание"; // Column D

  // Merge cells for "Обща цена без ДДС" (Columns K-M)
  worksheet.mergeCells(`K${headerRowIdx}:M${headerRowIdx}`);
  headerRow.getCell(11).value = "Обща цена без ДДС"; // Column K

  // Style all header cells
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
    };
  });

  // --- Data Rows ---
  let currentRowIdx = 10; // Row 10 (0-indexed: row 9) - moved up one row
  let totalSum = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const discountPrice = product.unitPrice * (1 - product.discount / 100);
    const totalPrice = discountPrice * product.quantity;
    totalSum += totalPrice;

    const row = worksheet.getRow(currentRowIdx);
    row.height = 80; // Make row taller for images and details

    // No
    row.getCell(1).value = i + 1;
    row.getCell(1).alignment = { vertical: "middle", horizontal: "center" };

    // Description (Rich Text) - Merge cells D-F
    worksheet.mergeCells(`D${currentRowIdx}:F${currentRowIdx}`);
    const descriptionValue = {
      richText: [
        { text: `Модел: ${product.model}\n`, font: { bold: true } },
        { text: `Мощност: ${product.power}\n` },
        { text: `Светлинен поток: ${product.flux}\n` },
        { text: `Цветна температура: ${product.colorTemp}\n` },
        { text: `Напрежение: 220V\n` }, // Mock data
        { text: `Цвят: Черен\n` }, // Mock data
        { text: `Размер: L 1200 мм\n` }, // Mock data
        { text: `Описание: ${product.description || ""}` },
      ],
    };
    row.getCell(4).value = descriptionValue;
    row.getCell(4).alignment = { wrapText: true, vertical: "top" };

    // Measure (Column G)
    row.getCell(7).value = "бр.";
    row.getCell(7).alignment = { vertical: "middle", horizontal: "center" };

    // Quantity (Column H)
    row.getCell(8).value = product.quantity;
    row.getCell(8).alignment = { vertical: "middle", horizontal: "center" };

    // Unit Price (Column I)
    row.getCell(9).value = product.unitPrice;
    row.getCell(9).numFmt = '#,##0.00 "€"';
    row.getCell(9).alignment = { vertical: "middle", horizontal: "center" };

    // Discounted Price (Column J)
    row.getCell(10).value = discountPrice;
    row.getCell(10).numFmt = '#,##0.00 "€"';
    row.getCell(10).alignment = { vertical: "middle", horizontal: "center" };

    // Total Price (Column K-M merged)
    worksheet.mergeCells(`K${currentRowIdx}:M${currentRowIdx}`);
    row.getCell(11).value = totalPrice;
    row.getCell(11).numFmt = '#,##0.00 "€"';
    row.getCell(11).alignment = { vertical: "middle", horizontal: "center" };

    // Add row lines
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "dotted", color: { argb: "FFCCCCCC" } },
      };
    });

    currentRowIdx++;
  }

  // --- Footer Section ---
  currentRowIdx++; // Gap

  // Total Table (using columns J and K-M merged)
  const totalRow = worksheet.getRow(currentRowIdx);
  totalRow.getCell(10).value = "Обща сума без ДДС с 15% ТО"; // Column J
  totalRow.getCell(10).font = { bold: true };
  totalRow.getCell(10).alignment = { horizontal: "right" };
  worksheet.mergeCells(`K${currentRowIdx}:M${currentRowIdx}`);
  totalRow.getCell(11).value = totalSum; // Column K
  totalRow.getCell(11).numFmt = '#,##0.00 "€"';
  totalRow.getCell(11).font = { bold: true };
  totalRow.getCell(11).alignment = { horizontal: "center" };

  currentRowIdx++;
  const vatRow = worksheet.getRow(currentRowIdx);
  vatRow.getCell(10).value = "ДДС 20%"; // Column J
  vatRow.getCell(10).alignment = { horizontal: "right" };
  worksheet.mergeCells(`K${currentRowIdx}:M${currentRowIdx}`);
  vatRow.getCell(11).value = totalSum * 0.2; // Column K
  vatRow.getCell(11).numFmt = '#,##0.00 "€"';
  vatRow.getCell(11).alignment = { horizontal: "center" };

  currentRowIdx++;
  const grandTotalRow = worksheet.getRow(currentRowIdx);
  grandTotalRow.getCell(10).value = "Обща сума с ДДС"; // Column J
  grandTotalRow.getCell(10).alignment = { horizontal: "right" };
  worksheet.mergeCells(`K${currentRowIdx}:M${currentRowIdx}`);
  grandTotalRow.getCell(11).value = totalSum * 1.2; // Column K
  grandTotalRow.getCell(11).numFmt = '#,##0.00 "€"';
  grandTotalRow.getCell(11).alignment = { horizontal: "center" };

  // Terms (Red text)
  currentRowIdx += 2;
  const termsStartRow = currentRowIdx;
  const terms = [
    "* Срок на доставка: 4-6 седмици след авансово плащане",
    "* Валидност на офертата – 20 дни",
    "* Офертата не включва монтаж",
    "* Начин на плащане: Банков път 50% аванс, 50% преди доставка",
  ];

  terms.forEach((term, idx) => {
    const row = worksheet.getRow(termsStartRow + idx);
    row.getCell(1).value = term;
    row.getCell(1).font = { color: { argb: "FFFF0000" } };
    worksheet.mergeCells(`A${termsStartRow + idx}:E${termsStartRow + idx}`);
  });

  // Signature
  currentRowIdx = termsStartRow + terms.length + 2;
  const footerCell = worksheet.getCell(`A${currentRowIdx}`);
  footerCell.value = "гр. Варна\nТелефон: 0889128161";
  footerCell.alignment = { wrapText: true };

  const signatureCell = worksheet.getCell(`H${currentRowIdx}`);
  signatureCell.value = "Търговски представител:\nКирил Борисов";
  signatureCell.alignment = { wrapText: true, horizontal: "center" };

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Polaris_Offer.xlsx");
};
