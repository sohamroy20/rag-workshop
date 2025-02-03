import fs from 'fs';
import path from 'path';

// List of base job categories
const jobCategories = [
    "Software Engineer", "Data Scientist", "AI Researcher", "Machine Learning Engineer",
    "Backend Developer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer",
    "Cloud Engineer", "Security Engineer", "Database Administrator", "Blockchain Developer",
    "Embedded Systems Engineer", "Game Developer", "Robotics Engineer", "IoT Engineer",
    "Cybersecurity Analyst", "System Administrator", "Mathematician", "Algorithm Engineer",
    "Computer Vision Engineer", "NLP Engineer", "Quantitative Analyst", "AI Ethics Researcher",
    "AI Engineer", "Product Designer", "UI/UX Designer", "Graphic Designer",
    "IT Support Specialist", "Data Engineer", "Big Data Engineer", "Network Engineer"
];

// Different variations of job listings
const jobModifiers = [
    "", "Intern", "Junior", "Senior", "Lead", "Manager", "Director", "Consultant", "Specialist"
];

const jobTypes = ["Remote", "Hybrid", "On-site", "Worldwide", "Europe", "USA"];

let allKeywords = [];

// Generate all combinations
for (const category of jobCategories) {
    for (const modifier of jobModifiers) {
        for (const type of jobTypes) {
            const jobTitle = `${modifier} ${category}`.trim();
            allKeywords.push({ jobTitle, location: type });
        }
    }
}

// Save to a JSON file
const filePath = path.join(path.resolve(), "src/scripts/job_keywords.json");
fs.writeFileSync(filePath, JSON.stringify(allKeywords, null, 4));

console.log(`✅ Job keywords saved to ${filePath}`);
