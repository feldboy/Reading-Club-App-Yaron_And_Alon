const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

async function captureScreenshots() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
    });

    const page = await browser.newPage();

    try {
        console.log('📸 Starting screenshot capture...');

        // Wait for app to load
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        await page.waitForTimeout(2000);

        // 1. Home Page
        console.log('📷 Capturing Home Page...');
        await page.screenshot({
            path: path.join(assetsDir, 'home-page.png'),
            fullPage: false,
        });

        // 2. Login Page - try to navigate
        console.log('📷 Capturing Login Page...');
        try {
            await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
            await page.waitForTimeout(1000);
            await page.screenshot({
                path: path.join(assetsDir, 'login-page.png'),
                fullPage: false,
            });
        } catch (e) {
            console.log('⚠️  Login page not found, skipping...');
        }

        // 3. Create Review Page
        console.log('📷 Capturing Create Review Page...');
        try {
            await page.goto('http://localhost:5173/create-review', { waitUntil: 'networkidle0' });
            await page.waitForTimeout(1000);
            await page.screenshot({
                path: path.join(assetsDir, 'create-review-page.png'),
                fullPage: false,
            });
        } catch (e) {
            console.log('⚠️  Create Review page not found, skipping...');
        }

        // 4. Review Card - zoom into a specific review
        console.log('📷 Capturing Review Card...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        await page.waitForTimeout(2000);

        // Try to find and screenshot a review card
        const reviewCard = await page.$('[class*="BookCard"], [class*="ReviewCard"], article, .card');
        if (reviewCard) {
            await reviewCard.screenshot({
                path: path.join(assetsDir, 'review-card.png'),
            });
        }

        // 5. Full page screenshot for reference
        console.log('📷 Capturing Full Page...');
        await page.screenshot({
            path: path.join(assetsDir, 'full-page.png'),
            fullPage: true,
        });

        console.log('✅ Screenshots captured successfully!');
        console.log(`📁 Saved to: ${assetsDir}`);
    } catch (error) {
        console.error('❌ Error capturing screenshots:', error);
    } finally {
        await browser.close();
    }
}

captureScreenshots();
