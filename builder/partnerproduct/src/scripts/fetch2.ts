// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";

// // Fix for __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load .env from builder/partnerproduct/
// dotenv.config({ path: path.join(__dirname, "../../.env") });

// // Read LinkedIn Credentials from .env
// const email = process.env.LINKEDIN_EMAIL;
// const password = process.env.LINKEDIN_PASSWORD;

// // Path to store job postings
// const filePath = path.join(__dirname, "../job_postings.json");

// // Ensure job_postings.json exists before writing
// if (!fs.existsSync(filePath)) {
//     fs.writeFileSync(filePath, "[]");
// }

// // Function to mimic human-like mouse movements
// async function humanLikeMouseMovements(page: puppeteer.Page) {
//     await page.mouse.move(Math.random() * 500, Math.random() * 500);
//     await page.evaluate(() => new Promise(res => setTimeout(res, 500)));
//     await page.mouse.move(Math.random() * 800, Math.random() * 800);
//     await page.evaluate(() => new Promise(res => setTimeout(res, 500)));
// }

// async function scrapeLinkedInJobs(keyword: string, location: string) {
//     console.log(`🔍 Searching LinkedIn for jobs: ${keyword} in ${location}...`);

//     const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;

//     // Launch Puppeteer with anti-bot settings
//     const browser = await puppeteer.launch({
//         headless: false, // Run in visible mode
//         slowMo: 30, // Add delay to mimic human interactions
//         args: [
//             "--no-sandbox",
//             "--disable-setuid-sandbox",
//             "--disable-blink-features=AutomationControlled", // Prevent LinkedIn from detecting Puppeteer
//             "--start-maximized",
//         ],
//         defaultViewport: null, // Full-size browser window
//         userDataDir: path.join(__dirname, "../../linkedin-session"), // Save login session
//     });

//     const page = await browser.newPage();

//     try {
//         // Step 1: Open LinkedIn Login Page
//         await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });

//         // Step 2: Check if already logged in
//         const isLoggedIn = await page.evaluate(() => !!document.querySelector("#global-nav"));
//         if (isLoggedIn) {
//             console.log("✅ Already logged into LinkedIn! Skipping login step...");
//         } else {
//             console.log("🔑 Logging into LinkedIn...");

//             await page.type("#username", email, { delay: Math.random() * 200 });
//             await page.type("#password", password, { delay: Math.random() * 200 });

//             // Simulate human-like behavior
//             await humanLikeMouseMovements(page);

//             await page.click('[type="submit"]');

//             // Step 3: Wait for login to complete
//             await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });

//             console.log("✅ Successfully logged in!");
//         }

//         // Step 4: Navigate to LinkedIn Job Search Page
//         try {
//             await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
//         } catch (error) {
//             console.error("❌ Jobs page failed to load! Retrying...");
//             await page.evaluate(() => new Promise(res => setTimeout(res, 5000))); // Wait before retry
//             await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
//         }

//         // Step 4.1: Wait for job listings to appear (use updated selector)
//         try {
//             await page.waitForSelector(".job-card-container", { timeout: 90000 }); // New LinkedIn job container selector
//         } catch (err) {
//             console.error("❌ Job listings did not load! Retrying...");
//             await page.reload({ waitUntil: "domcontentloaded" });
//             await page.waitForSelector(".job-card-container", { timeout: 90000 });
//         }

//         console.log("✅ Job listings loaded successfully!");

//         // Step 5: Scroll to Load More Job Postings
//         for (let i = 0; i < 5; i++) {
//             await page.evaluate(() => {
//                 window.scrollBy(0, window.innerHeight);
//             });
//             await page.evaluate(() => new Promise(res => setTimeout(res, 2000))); // Fix waitForTimeout issue
//         }

//         // Step 6: Extract Job Details (updated selectors)
//         const jobList = await page.evaluate(() => {
//             const jobs: any[] = [];
//             document.querySelectorAll(".job-card-container").forEach((jobElement) => {
//                 const titleElement = jobElement.querySelector(".job-card-list__title--link");
//                 const companyElement = jobElement.querySelector(".artdeco-entity-lockup__subtitle");
//                 const locationElement = jobElement.querySelector(".job-card-container__metadata-wrapper span");
//                 const linkElement = titleElement?.closest("a");

//                 const title = titleElement?.textContent?.trim() || "Unknown Title";
//                 const company = companyElement?.textContent?.trim() || "Unknown Company";
//                 const location = locationElement?.textContent?.trim() || "Unknown Location";
//                 const link = linkElement ? "https://www.linkedin.com" + linkElement.getAttribute("href") : "#";

//                 jobs.push({ title, company, location, link });
//             });
//             return jobs;
//         });

//         // Step 7: Save Jobs to job_postings.json
//         fs.writeFileSync(filePath, JSON.stringify(jobList, null, 4));

//         console.log("✅ LinkedIn jobs updated and saved to job_postings.json!");

//         await browser.close();
//         return jobList;
//     } catch (error) {
//         console.error("❌ Error fetching LinkedIn jobs:", error.message);
//         await browser.close();
//         return [];
//     }
// }

// // Export function for chatbot integration
// export { scrapeLinkedInJobs };

// // Example Run (Test the Scraper)
// scrapeLinkedInJobs("Graphics Designer", "Hybrid").then(console.log);
