import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from builder/partnerproduct/
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Read LinkedIn Credentials from .env
const email = process.env.LINKEDIN_EMAIL;
const password = process.env.LINKEDIN_PASSWORD;

// Paths to JSON files
const jobKeywordsPath = path.join(__dirname, "job_keywords.json");
const jobPostingsPath = path.join(__dirname, "../job_postings.json");

// Ensure job_postings.json exists before writing
if (!fs.existsSync(jobPostingsPath)) {
    fs.writeFileSync(jobPostingsPath, "[]");
}

// Load job keywords
const jobKeywords = JSON.parse(fs.readFileSync(jobKeywordsPath, "utf-8"));

// Function to mimic human-like mouse movements
async function humanLikeMouseMovements(page: puppeteer.Page) {
    await page.mouse.move(Math.random() * 500, Math.random() * 500);
    await page.evaluate(() => new Promise(res => setTimeout(res, 500)));
    await page.mouse.move(Math.random() * 800, Math.random() * 800);
    await page.evaluate(() => new Promise(res => setTimeout(res, 500)));
}

async function scrapeLinkedInJobs(keyword: string, location: string) {
    console.log(`🔍 Searching LinkedIn for jobs: ${keyword} in ${location}...`);

    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 30,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--start-maximized",
        ],
        defaultViewport: null,
        userDataDir: path.join(__dirname, "../../linkedin-session"),
    });

    const page = await browser.newPage();

    try {
        // Open LinkedIn
        await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });

        // Check if already logged in
        const isLoggedIn = await page.evaluate(() => !!document.querySelector("#global-nav"));
        if (!isLoggedIn) {
            console.log("🔑 Logging into LinkedIn...");

            await page.type("#username", email, { delay: Math.random() * 200 });
            await page.type("#password", password, { delay: Math.random() * 200 });

            await humanLikeMouseMovements(page);
            await page.click('[type="submit"]');
            await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });

            console.log("✅ Successfully logged in!");
        } else {
            console.log("✅ Already logged into LinkedIn! Skipping login step...");
        }

        // Visit Job Search Page
        await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Wait for job listings
        try {
            await page.waitForSelector(".job-card-container", { timeout: 90000 });
        } catch (err) {
            console.error("❌ Job listings did not load! Retrying...");
            await page.reload({ waitUntil: "domcontentloaded" });
            await page.waitForSelector(".job-card-container", { timeout: 90000 });
        }

        console.log("✅ Job listings loaded successfully!");

        // Scroll down to load more jobs
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            await page.evaluate(() => new Promise(res => setTimeout(res, 2000)));
        }

        // Extract job details
        const jobList = await page.evaluate(() => {
            const jobs: any[] = [];
            document.querySelectorAll(".job-card-container").forEach((jobElement) => {
                const titleElement = jobElement.querySelector(".job-card-list__title--link");
                const companyElement = jobElement.querySelector(".artdeco-entity-lockup__subtitle");
                const locationElement = jobElement.querySelector(".job-card-container__metadata-wrapper span");
                const linkElement = titleElement?.closest("a");

                const title = titleElement?.textContent?.trim() || "Unknown Title";
                const company = companyElement?.textContent?.trim() || "Unknown Company";
                const location = locationElement?.textContent?.trim() || "Unknown Location";
                const link = linkElement ? "https://www.linkedin.com" + linkElement.getAttribute("href") : "#";

                jobs.push({ title, company, location, link });
            });
            return jobs;
        });

        // Append new jobs to JSON file
        let existingJobs = JSON.parse(fs.readFileSync(jobPostingsPath, "utf-8"));
        existingJobs = [...existingJobs, ...jobList];
        fs.writeFileSync(jobPostingsPath, JSON.stringify(existingJobs, null, 4));

        console.log("✅ Jobs appended to job_postings.json!");

        await browser.close();
    } catch (error) {
        console.error("❌ Error fetching LinkedIn jobs:", error.message);
        await browser.close();
    }
}

// **Loop through all job titles**
(async () => {
    for (const { jobTitle, location } of jobKeywords) {
        await scrapeLinkedInJobs(jobTitle, location);
    }
})();
