// Regenerates data/workers.json with sample catalogue data for local/demo
// use. Replace this entirely once wired to the real worker-verification
// pipeline / database.
import { writeFileSync } from "fs";

const cities = ["Delhi NCR", "Mumbai", "Bengaluru", "Pune", "Hyderabad"];
const names = {
  maid: ["Sunita Devi", "Rekha Kumari", "Anita Yadav", "Pooja Sharma"],
  cook: ["Ramesh Prasad", "Kavita Singh", "Suresh Rawat", "Meena Joshi"],
  driver: ["Vikram Rathi", "Sandeep Kumar", "Rajesh Meena", "Ajay Verma"],
  babysitter: ["Priya Nair", "Geeta Rani", "Shalini Rao"],
  "elder-care": ["Kamla Devi", "Manoj Tiwari", "Usha Bhatt"],
  "security-guard": ["Bhupinder Singh", "Naresh Chauhan", "Om Prakash"],
  "office-boy": ["Deepak Kumar", "Ravi Shankar"],
  housekeeping: ["Lakshmi Reddy", "Sarita Devi", "Manju Gupta"],
  cleaner: ["Farhan Ali", "Vinod Kumar"],
  gardener: ["Chandan Mali", "Ram Singh Mali"],
  electrician: ["Irfan Sheikh", "Prakash Ambekar", "Yogesh Nair"],
  plumber: ["Salim Khan", "Dinesh Chavan"],
  "ac-repair": ["Amit Solanki", "Tariq Ahmed"],
  carpenter: ["Ganesh Sutar", "Iqbal Hussain"],
  "deep-cleaning": ["Team Spotless", "Team ShineCrew"],
};

const subServiceMap = {
  maid: ["Sweeping & mopping", "Dishwashing", "Dusting", "Laundry"],
  cook: ["North Indian", "South Indian", "Tiffin service", "Continental"],
  driver: ["Personal car", "School drop", "Outstation", "Corporate"],
  babysitter: ["Infant care", "Toddler care", "Homework support"],
  "elder-care": ["Companionship", "Medication reminders", "Mobility support"],
  "security-guard": ["Residential gate", "Commercial", "Night shift"],
  "office-boy": ["Pantry & errands", "Filing & courier"],
  housekeeping: ["Common area upkeep", "Society housekeeping"],
  cleaner: ["Bathroom deep clean", "Kitchen deep clean"],
  gardener: ["Lawn maintenance", "Potted plants", "Landscaping"],
  electrician: ["Wiring", "Switchboard repair", "Fan/light install"],
  plumber: ["Leak repair", "Fitting install", "Drainage"],
  "ac-repair": ["Split AC service", "Gas refill", "Installation"],
  carpenter: ["Furniture repair", "Modular fitting"],
  "deep-cleaning": ["Move-in clean", "Festive deep clean", "Sofa & carpet"],
};

const first = (arr, i) => arr[i % arr.length];
let idCounter = 1;
const workers = [];

for (const [category, list] of Object.entries(names)) {
  list.forEach((name, i) => {
    const id = `w${String(idCounter).padStart(4, "0")}`;
    idCounter += 1;
    const salaryBase = 8000 + (idCounter % 10) * 1500;
    workers.push({
      id,
      name,
      category,
      subServices: subServiceMap[category].slice(0, 2 + (i % 2)),
      gender: i % 3 === 0 ? "male" : i % 3 === 1 ? "female" : "any",
      ageBand: first(["26-35", "36-45", "18-25", "46-55"], i),
      city: first(cities, idCounter),
      areas: [first(["Sector 18", "Andheri West", "Koramangala", "Baner", "Gachibowli"], idCounter)],
      experienceYears: 1 + (idCounter % 12),
      languages: first([["Hindi", "English"], ["Hindi"], ["Hindi", "English", "Marathi"], ["Hindi", "Kannada"]], idCounter),
      salaryType: first(["monthly", "per-visit", "hourly", "per-job"], idCounter),
      salaryFrom: salaryBase,
      salaryTo: salaryBase + 4000,
      availability: first([["full-time"], ["part-time"], ["full-time", "live-in"], ["part-time", "trial-day"]], idCounter),
      verification: {
        policeVerified: true,
        backgroundVerified: true,
        kycVerified: true,
        medicalCheckup: idCounter % 4 !== 0,
        vaccinated: idCounter % 3 !== 0,
        trainingCertified: idCounter % 2 === 0,
      },
      bio: `${name.split(" ")[0]} has ${1 + (idCounter % 12)} years of verified experience and is background-checked through MEUN's standard pipeline.`,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6D3FF0&color=FFFFFF&size=256&font-size=0.33`,
    });
  });
}

writeFileSync(
  new URL("../data/workers.json", import.meta.url),
  JSON.stringify(workers, null, 2)
);

console.log(`Seeded ${workers.length} sample worker profiles into data/workers.json`);
