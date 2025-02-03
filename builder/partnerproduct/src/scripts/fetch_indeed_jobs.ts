import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// Define the path to job_postings.json
const filePath = path.join(__dirname, "../job_postings.json");

// Ensure `job_postings.json` exists before writing
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
}

async function scrapeIndeedJobs(keyword: string, location: string) {
    console.log(`🔍 Searching Indeed for jobs: ${keyword} in ${location}...`);

    const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}`;

    // Launch Puppeteer (set headless to false if you want to see the browser in action)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set user agent to mimic a real browser
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    try {
        // Go to Indeed job search page
        await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Wait for job listings to load (increase timeout to 20s)
        await page.waitForSelector(".job_card", { timeout: 20000 });

        // Scroll down multiple times to load more jobs
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            await page.evaluate(() => new Promise(res => setTimeout(res, 2000))); // Replaces waitForTimeout
        }

        // Extract job details
        const jobList = await page.evaluate(() => {
            const jobs: any[] = [];
            document.querySelectorAll(".job_card").forEach((jobElement) => {
                const title = jobElement.querySelector("h2")?.textContent?.trim() || "Unknown Title";
                const company = jobElement.querySelector(".companyName")?.textContent?.trim() || "Unknown Company";
                const location = jobElement.querySelector(".companyLocation")?.textContent?.trim() || "Unknown Location";
                const linkElement = jobElement.querySelector("a");
                const link = linkElement ? "https://www.indeed.com" + linkElement.getAttribute("href") : "#";

                jobs.push({ title, company, location, link });
            });
            return jobs;
        });

        // Save job postings to job_postings.json
        fs.writeFileSync(filePath, JSON.stringify(jobList, null, 4));

        console.log("✅ Indeed jobs updated and saved to job_postings.json!");

        await browser.close();
        return jobList;
    } catch (error) {
        console.error("❌ Error fetching Indeed jobs:", error.message);
        await browser.close();
        return [];
    }
}

// Export function for later use
export { scrapeIndeedJobs };

// Example Run (Test the Scraper)
scrapeIndeedJobs("Software Developer", "Remote").then(console.log);
