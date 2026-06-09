# Order Tracking System

A comprehensive web-based order tracker that integrates with Google Sheets to track orders from QC inspection through packing, with automatic timing and duration calculations.

## Features

✅ **Real-time Barcode/QR Code Scanning** - Supports standard barcode scanner input
✅ **Automatic Timing** - Start date/time triggered on order scan
✅ **Employee Tracking** - Track QC and Packer names via QR code scans
✅ **Smart End Time Calculation** - End time automatically set to 30 minutes after packer assignment
✅ **Duration Calculation** - Automatic calculation of total processing hours
✅ **Google Sheets Integration** - All data stored in Google Sheets
✅ **Active Order Dashboard** - Real-time view of in-progress orders
✅ **Completed Orders History** - Complete database of finished orders
✅ **Search & Filter** - Filter completed orders by order number
✅ **Statistics Dashboard** - Track KPIs and performance metrics
✅ **Responsive Design** - Works on desktop and mobile devices

## Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Order Tracker"
3. Note your **Sheet ID** (from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`)

### Step 2: Deploy Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy the entire contents of `apps-script.gs` into the editor
4. Change `SHEET_NAME = 'Orders'` if using a different sheet name
5. Click **Save** and give the project a name (e.g., "Order Tracker Backend")
6. Run the `initializeSheet()` function once to create headers:
   - Select `initializeSheet` from the dropdown
   - Click **Run**
   - Authorize the script when prompted
7. Deploy as a Web App:
   - Click **Deploy** → **New Deployment**
   - Select **Type: Web app**
   - Set **Execute as: Your account**
   - Set **Who has access: Anyone**
   - Click **Deploy**
   - Copy the **Deployment URL** (you'll need this in Step 3)

### Step 3: Deploy the Web Tracker

#### Option A: Using GitHub Pages

1. Create a new GitHub repository named `web-tracker`
2. Upload the following files to the repository:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Go to **Settings** → **Pages**
4. Select **Source: main branch**
5. Your tracker will be available at `https://yourusername.github.io/web-tracker/`

#### Option B: Self-Hosted

1. Download all files (`index.html`, `styles.css`, `script.js`)
2. Upload to your web server
3. Access via your server's URL

### Step 4: Configure Settings

1. Open the tracker in your browser
2. Click the **⚙️ Settings** button (bottom left)
3. Paste your **Google Sheet ID**
4. Paste your **Apps Script Web App URL**
5. Click **Save Settings**

## How to Use

### Scanning Orders

The system supports three types of scans:

#### 1. **Start Order** (Barcode Scan)
- Scan the order number barcode
- Format: Any numeric barcode or `ORD-12345`
- Action: Creates a new active order with start time

#### 2. **Assign QC** (QR Code Scan)
- Scan the QR code containing the QC employee's name
- Format: `QC:John Doe` (recommended) or just `John Doe`
- Action: Assigns QC to the most recent active order

#### 3. **Assign Packer** (QR Code Scan)
- Scan the QR code containing the Packer employee's name
- Format: `PACKER:Jane Smith` (recommended) or just `Jane Smith`
- Action: Assigns packer and automatically sets end time to +30 minutes, completes the order

### Order Status Flow
