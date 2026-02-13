const puppeteer = require('puppeteer');

/**
 * Automated Demo Recording Script
 *
 * This script automates the Reading Club App for screen recording.
 *
 * USAGE:
 * 1. Start backend: cd backend && npm run dev
 * 2. Start frontend: cd frontend && npm run dev
 * 3. Start OBS/QuickTime screen recording
 * 4. Run: node record-demo.js
 * 5. Stop recording when done
 */

const FRONTEND_URL = 'http://localhost:5173';
const SLOW_MO = 100; // Slow down actions for visibility

// Demo credentials
const DEMO_USER = {
    email: 'demo@test.com',
    password: 'password123',
    username: 'DemoUser'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function recordDemo() {
    console.log('🎬 Starting Reading Club App Demo...\n');
    console.log('📹 Make sure OBS/QuickTime is recording!\n');

    await delay(3000); // Give time to start recording

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--window-size=1920,1080'
        ],
        slowMo: SLOW_MO
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        // ============================================
        // SECTION 1: LOGIN PAGE
        // ============================================
        console.log('📍 Section 1: Authentication');
        await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
        await delay(2000);

        // Check if we need to login
        const loginButton = await page.$('a[href*="login"], button:has-text("Login"), button:has-text("Sign In")');
        if (loginButton) {
            await loginButton.click();
            await delay(1500);
        }

        // Fill login form
        const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email" i]');
        if (emailInput) {
            await emailInput.click();
            await delay(500);
            await page.keyboard.type(DEMO_USER.email, { delay: 80 });
            await delay(1000);
        }

        const passwordInput = await page.$('input[type="password"]');
        if (passwordInput) {
            await passwordInput.click();
            await delay(500);
            await page.keyboard.type(DEMO_USER.password, { delay: 80 });
            await delay(1000);
        }

        // Click login button
        const submitBtn = await page.$('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
        if (submitBtn) {
            await submitBtn.click();
            await delay(3000);
        }

        // ============================================
        // SECTION 2: HOME PAGE & FEED
        // ============================================
        console.log('📍 Section 2: Home Page & Feed');
        await delay(2000);

        // Scroll to show infinite scroll
        for (let i = 0; i < 3; i++) {
            await page.evaluate(() => window.scrollBy(0, 500));
            await delay(1500);
        }

        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await delay(2000);

        // ============================================
        // SECTION 3: AI SEARCH
        // ============================================
        console.log('📍 Section 3: AI Search');

        const searchInput = await page.$('input[placeholder*="search" i], input[type="search"]');
        if (searchInput) {
            await searchInput.click();
            await delay(500);
            await page.keyboard.type('sci-fi books about space exploration', { delay: 60 });
            await delay(3000);

            // Clear search
            await searchInput.click({ clickCount: 3 });
            await page.keyboard.press('Backspace');
            await delay(1000);
        }

        // ============================================
        // SECTION 4: CREATE REVIEW
        // ============================================
        console.log('📍 Section 4: Create Review');

        // Navigate to create review
        const createBtn = await page.$('a[href*="create"], button:has-text("Create"), a[href*="review/new"]');
        if (createBtn) {
            await createBtn.click();
            await delay(2000);
        }

        // Search for book
        const bookSearch = await page.$('input[placeholder*="book" i], input[placeholder*="search" i]');
        if (bookSearch) {
            await bookSearch.click();
            await delay(500);
            await page.keyboard.type('The Martian', { delay: 80 });
            await delay(2000);

            // Click first result
            const firstResult = await page.$('[class*="result"], [class*="suggestion"], li:first-child');
            if (firstResult) {
                await firstResult.click();
                await delay(1500);
            }
        }

        // Add rating (click 5 stars)
        const stars = await page.$$('[class*="star"], svg[class*="star"]');
        if (stars.length >= 5) {
            await stars[4].click();
            await delay(1000);
        }

        // Write review
        const reviewText = await page.$('textarea');
        if (reviewText) {
            await reviewText.click();
            await delay(500);
            await page.keyboard.type(
                'An incredible sci-fi thriller that combines hard science with gripping storytelling. Highly recommend!',
                { delay: 40 }
            );
            await delay(2000);
        }

        // Go back to home
        await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
        await delay(2000);

        // ============================================
        // SECTION 5: SOCIAL - LIKE & COMMENT
        // ============================================
        console.log('📍 Section 5: Social Interactions');

        // Click like on first review
        const likeBtn = await page.$('[class*="like"], button[aria-label*="like" i], svg[class*="heart"]');
        if (likeBtn) {
            await likeBtn.click();
            await delay(1500);
            await likeBtn.click(); // Unlike
            await delay(1000);
        }

        // Click on a review to see details
        const reviewCard = await page.$('[class*="review-card"], [class*="ReviewCard"], article');
        if (reviewCard) {
            await reviewCard.click();
            await delay(2000);

            // Scroll to comments
            await page.evaluate(() => window.scrollBy(0, 300));
            await delay(1500);

            // Go back
            await page.goBack();
            await delay(1500);
        }

        // ============================================
        // SECTION 6: DISCOVER
        // ============================================
        console.log('📍 Section 6: Book Discovery');

        const discoverLink = await page.$('a[href*="discover"], a[href*="explore"], nav a:nth-child(2)');
        if (discoverLink) {
            await discoverLink.click();
            await delay(2000);

            // Click a category
            const categoryChip = await page.$('[class*="chip"], [class*="category"], button[class*="filter"]');
            if (categoryChip) {
                await categoryChip.click();
                await delay(2000);
            }

            // Search
            const discoverSearch = await page.$('input[type="search"], input[placeholder*="search" i]');
            if (discoverSearch) {
                await discoverSearch.click();
                await page.keyboard.type('Harry Potter', { delay: 80 });
                await delay(2000);
            }
        }

        // ============================================
        // SECTION 7: READING CLUBS
        // ============================================
        console.log('📍 Section 7: Reading Clubs');

        const clubsLink = await page.$('a[href*="club"], nav a:nth-child(3)');
        if (clubsLink) {
            await clubsLink.click();
            await delay(2000);

            // Scroll through clubs
            await page.evaluate(() => window.scrollBy(0, 300));
            await delay(1500);
            await page.evaluate(() => window.scrollTo(0, 0));
            await delay(1000);

            // Click join on a club
            const joinBtn = await page.$('button:has-text("Join"), button[class*="join"]');
            if (joinBtn) {
                await joinBtn.click();
                await delay(2000);
            }
        }

        // ============================================
        // SECTION 8: WISHLIST
        // ============================================
        console.log('📍 Section 8: Wishlist');

        const wishlistLink = await page.$('a[href*="wishlist"], a[href*="saved"]');
        if (wishlistLink) {
            await wishlistLink.click();
            await delay(2000);

            // Scroll through wishlist
            await page.evaluate(() => window.scrollBy(0, 200));
            await delay(1500);
        }

        // ============================================
        // SECTION 9: PROFILE
        // ============================================
        console.log('📍 Section 9: User Profile');

        const profileLink = await page.$('a[href*="profile"], [class*="avatar"], img[class*="avatar"]');
        if (profileLink) {
            await profileLink.click();
            await delay(2000);

            // Scroll to show reviews
            await page.evaluate(() => window.scrollBy(0, 300));
            await delay(1500);
        }

        // ============================================
        // SECTION 10: RESPONSIVE DEMO
        // ============================================
        console.log('📍 Section 10: Responsive Design');

        await page.goto(FRONTEND_URL, { waitUntil: 'networkidle2' });
        await delay(1500);

        // Tablet view
        await page.setViewport({ width: 768, height: 1024 });
        await delay(2000);

        // Mobile view
        await page.setViewport({ width: 375, height: 812 });
        await delay(2000);

        // Back to desktop
        await page.setViewport({ width: 1920, height: 1080 });
        await delay(2000);

        // ============================================
        // DONE
        // ============================================
        console.log('\n✅ Demo complete! Stop your screen recording.\n');
        await delay(5000);

    } catch (error) {
        console.error('Error during demo:', error);
    } finally {
        await browser.close();
    }
}

// Run
recordDemo().catch(console.error);
