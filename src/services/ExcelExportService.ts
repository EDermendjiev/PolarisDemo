import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
    const worksheet = workbook.addWorksheet('Оферта');

    // Setup Columns
    worksheet.columns = [
        { header: '', key: 'no', width: 5 },
        { header: '', key: 'image', width: 15 },
        { header: '', key: 'drawing', width: 15 },
        { header: '', key: 'description', width: 50 },
        { header: '', key: 'measure', width: 8 },
        { header: '', key: 'qty', width: 8 },
        { header: '', key: 'unitPrice', width: 12 },
        { header: '', key: 'discountPrice', width: 12 },
        { header: '', key: 'totalPrice', width: 12 },
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

    // Polaris Logo (Top Left)
    const polarisLogoBuffer = await fetchImage('/polarisLogo.png') || await fetchImage('/favicon.png');
    if (polarisLogoBuffer) {
        const imageId = workbook.addImage({
            buffer: polarisLogoBuffer,
            extension: 'png',
        });
        worksheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: 180, height: 120 }
        });
    }

    // Partner Logos (Row 0-2)
    const partnerLogos = [
        'deltalightLogo.jpg', 'nowodvorskiLogo.jpg', 'redoLogo.jpg', 'ledsLogo.png',
        'philipsLogo.png', 'novaluceLogo.png', 'areluxLogo.jpg', 'idealluxLogo.png'
    ];

    // We will place them in a grid in the header area (columns 1-8)
    // This is a rough approximation of the layout
    for (let i = 0; i < partnerLogos.length; i++) {
        const logoFilename = partnerLogos[i];
        const buffer = await fetchImage(`/logos/${logoFilename}`);
        if (buffer) {
            const extension = logoFilename.split('.').pop() as 'png' | 'jpeg' | 'jpg';
            const imageId = workbook.addImage({
                buffer: buffer,
                extension: extension === 'jpg' ? 'jpeg' : extension,
            });

            // Calculate position - increase spacing to prevent overlap
            const col = (i % 4) * 2.5 + 3; // Start at col 3, spread 2.5 columns apart
            const row = Math.floor(i / 4) * 3; // Row 0 for first group, row 3 for second

            worksheet.addImage(imageId, {
                tl: { col: col, row: row },
                ext: { width: 120, height: 45 },
                editAs: 'oneCell'
            });
        }
    }


    // Company Info (Row 3-6, Col 0)
    worksheet.mergeCells('A4:B7');
    const infoCell = worksheet.getCell('A4');
    infoCell.value = 'Варна\nул. Мургаш №5\nтел: 0889128161\ne-mail: k.borisov@polarislighting.bg';
    infoCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    infoCell.font = { size: 9 };

    // Offer Title (Row 9)
    worksheet.mergeCells('A9:I9');
    const titleCell = worksheet.getCell('A9');
    titleCell.value = 'Оферта Севдана - къща - Поръчка 3'; // Dynamic title would go here
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center' };

    // --- Table Header ---
    const headerRowIdx = 10;
    const headerRow = worksheet.getRow(headerRowIdx);
    headerRow.values = [
        '№', 'Снимка', 'Чертеж', 'Описание', 'Мярка', 'Кол.', 'Ед. цена', '15% ТО', 'Обща цена без ДДС'
    ];
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
        };
    });

    // --- Data Rows ---
    let currentRowIdx = 11;
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
        row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Description (Rich Text)
        const descriptionValue = {
            richText: [
                { text: `Модел: ${product.model}\n`, font: { bold: true } },
                { text: `Мощност: ${product.power}\n` },
                { text: `Светлинен поток: ${product.flux}\n` },
                { text: `Цветна температура: ${product.colorTemp}\n` },
                { text: `Напрежение: 220V\n` }, // Mock data
                { text: `Цвят: Черен\n` }, // Mock data
                { text: `Размер: L 1200 мм\n` }, // Mock data
                { text: `Описание: ${product.description || ''}` }
            ]
        };
        row.getCell(4).value = descriptionValue;
        row.getCell(4).alignment = { wrapText: true, vertical: 'top' };

        // Measure
        row.getCell(5).value = 'бр.';
        row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };

        // Quantity
        row.getCell(6).value = product.quantity;
        row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };

        // Unit Price
        row.getCell(7).value = product.unitPrice;
        row.getCell(7).numFmt = '#,##0.00 "€"';
        row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };

        // Discounted Price
        row.getCell(8).value = discountPrice;
        row.getCell(8).numFmt = '#,##0.00 "€"';
        row.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };

        // Total Price
        row.getCell(9).value = totalPrice;
        row.getCell(9).numFmt = '#,##0.00 "€"';
        row.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add row lines
        row.eachCell((cell) => {
            cell.border = { bottom: { style: 'dotted', color: { argb: 'FFCCCCCC' } } };
        });

        currentRowIdx++;
    }

    // --- Footer Section ---
    currentRowIdx++; // Gap

    // Total Table
    const totalRow = worksheet.getRow(currentRowIdx);
    totalRow.getCell(8).value = 'Обща сума без ДДС с 15% ТО';
    totalRow.getCell(8).font = { bold: true };
    totalRow.getCell(8).alignment = { horizontal: 'right' };
    totalRow.getCell(9).value = totalSum;
    totalRow.getCell(9).numFmt = '#,##0.00 "€"';
    totalRow.getCell(9).font = { bold: true };

    currentRowIdx++;
    const vatRow = worksheet.getRow(currentRowIdx);
    vatRow.getCell(8).value = 'ДДС 20%';
    vatRow.getCell(8).alignment = { horizontal: 'right' };
    vatRow.getCell(9).value = totalSum * 0.2;
    vatRow.getCell(9).numFmt = '#,##0.00 "€"';

    currentRowIdx++;
    const grandTotalRow = worksheet.getRow(currentRowIdx);
    grandTotalRow.getCell(8).value = 'Обща сума с ДДС';
    grandTotalRow.getCell(8).alignment = { horizontal: 'right' };
    grandTotalRow.getCell(9).value = totalSum * 1.2;
    grandTotalRow.getCell(9).numFmt = '#,##0.00 "€"';


    // Terms (Red text)
    currentRowIdx += 2;
    const termsStartRow = currentRowIdx;
    const terms = [
        '* Срок на доставка: 4-6 седмици след авансово плащане',
        '* Валидност на офертата – 20 дни',
        '* Офертата не включва монтаж',
        '* Начин на плащане: Банков път 50% аванс, 50% преди доставка'
    ];

    terms.forEach((term, idx) => {
        const row = worksheet.getRow(termsStartRow + idx);
        row.getCell(1).value = term;
        row.getCell(1).font = { color: { argb: 'FFFF0000' } };
        worksheet.mergeCells(`A${termsStartRow + idx}:E${termsStartRow + idx}`);
    });

    // Signature
    currentRowIdx = termsStartRow + terms.length + 2;
    const footerCell = worksheet.getCell(`A${currentRowIdx}`);
    footerCell.value = 'гр. Варна\nТелефон: 0889128161';
    footerCell.alignment = { wrapText: true };

    const signatureCell = worksheet.getCell(`H${currentRowIdx}`);
    signatureCell.value = 'Търговски представител:\nКирил Борисов';
    signatureCell.alignment = { wrapText: true, horizontal: 'center' };


    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Polaris_Offer.xlsx');
};
