// Google Apps Script for handling web tracker data
// Deploy as a web app (Execute as: Your Account, Who has access: Anyone)

const SHEET_NAME = 'Orders'; // Change to your sheet name
const COLUMNS = {
    orderNum: 0,      // A
    qcName: 1,        // B
    packerName: 2,    // C
    startDateTime: 3, // D
    endDateTime: 4,   // E
    totalHours: 5,    // F
    timestamp: 6,     // G
};

/**
 * Main entry point for GET requests
 */
function doGet(e) {
    const action = e.parameter.action || 'getData';

    if (action === 'getData') {
        return getData();
    }

    return HtmlService.createHtmlOutput('Invalid action');
}

/**
 * Main entry point for POST requests
 */
function doPost(e) {
    try {
        const payload = JSON.parse(e.postData.contents);
        
        // Add row to sheet
        addOrderToSheet(payload);

        return ContentService
            .createTextOutput(JSON.stringify({
                success: true,
                message: 'Order saved successfully'
            }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('Error: ' + error);
        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: error.toString()
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Add a new order row to the sheet
 */
function addOrderToSheet(orderData) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

    // Get the next empty row
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;

    // Create row data
    const rowData = [
        orderData.orderNum,
        orderData.qcName,
        orderData.packerName,
        orderData.startDateTime,
        orderData.endDateTime,
        orderData.totalHours,
        new Date().toLocaleString()
    ];

    // Insert the row
    const range = sheet.getRange(nextRow, 1, 1, rowData.length);
    range.setValues([rowData]);

    Logger.log('Order added: ' + orderData.orderNum);
}

/**
 * Get all orders from the sheet
 */
function getData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: `Sheet "${SHEET_NAME}" not found`
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    // Get all data (skip header row)
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, Object.keys(COLUMNS).length).getValues();

    // Format as JSON
    const orders = data.map(row => ({
        orderNum: row[COLUMNS.orderNum],
        qcName: row[COLUMNS.qcName],
        packerName: row[COLUMNS.packerName],
        startDateTime: row[COLUMNS.startDateTime],
        endDateTime: row[COLUMNS.endDateTime],
        totalHours: row[COLUMNS.totalHours],
        timestamp: row[COLUMNS.timestamp]
    }));

    return ContentService
        .createTextOutput(JSON.stringify({
            success: true,
            data: orders,
            count: orders.length
        }))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize sheet headers (run this once)
 */
function initializeSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
    }

    // Add headers
    const headers = [
        'Order #',
        'QC Name',
        'Packer Name',
        'Start Date & Time',
        'End Date & Time',
        'Total Hrs',
        'Timestamp'
    ];

    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setValues([headers]);
    range.setFontWeight('bold');
    range.setBackground('#2563eb');
    range.setFontColor('white');

    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
    }

    Logger.log('Sheet initialized');
}

/**
 * Get statistics for the dashboard
 */
function getStatistics() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        return {
            totalOrders: 0,
            averageTime: 0,
            ordersToday: 0
        };
    }

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, Object.keys(COLUMNS).length).getValues();
    const today = new Date().toDateString();

    let totalOrders = data.length;
    let ordersToday = 0;
    let totalHours = 0;

    data.forEach(row => {
        const startDate = new Date(row[COLUMNS.startDateTime]);
        
        if (startDate.toDateString() === today) {
            ordersToday++;
        }

        const hours = parseFloat(row[COLUMNS.totalHours]);
        if (!isNaN(hours)) {
            totalHours += hours;
        }
    });

    const averageTime = totalOrders > 0 ? (totalHours / totalOrders).toFixed(2) : 0;

    return {
        totalOrders: totalOrders,
        averageTime: averageTime,
        ordersToday: ordersToday
    };
}

/**
 * Delete a row by order number (optional)
 */
function deleteOrder(orderNum) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip header
        if (data[i][COLUMNS.orderNum] === orderNum) {
            sheet.deleteRow(i + 1); // +1 because sheet rows are 1-indexed
            Logger.log('Order deleted: ' + orderNum);
            return;
        }
    }

    throw new Error('Order not found: ' + orderNum);
}
