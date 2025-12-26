
// const categoryContainer = document.getElementById("categoryOptions");
// const searchBtn = document.getElementById("searchBtn");
// const keywordInput = document.getElementById("searchKeyword");
// const locationInput = document.getElementById("searchLocation");

// const selectedCategories = new Set();

// /* ===== INITIAL LOAD ===== */
// renderJobs(jobs);

// /* ===== CATEGORY CHIPS ===== */
// const categories = [...new Set(jobs.map(j => j.category))];

// categories.forEach(cat => {
//   const chip = document.createElement("div");
//   chip.className =
//     "rounded-full border px-6 py-2 cursor-pointer text-gray-400";

//   chip.innerText = cat;

//   chip.onclick = () => {
//     if (selectedCategories.has(cat)) {
//       selectedCategories.delete(cat);
//       chip.classList.remove("bg-black", "text-white");
//     } else {
//       selectedCategories.add(cat);
//       chip.classList.add("bg-black", "text-white");
//     }
//     applyFilters();
//   };

//   categoryContainer.appendChild(chip);
// });

// /* ===== SEARCH ===== */
// searchBtn.addEventListener("click", applyFilters);
// keywordInput.addEventListener("input", applyFilters);
// locationInput.addEventListener("input", applyFilters);

// function applyFilters() {
//   const keyword = keywordInput.value.trim().toLowerCase();
//   const location = locationInput.value.trim().toLowerCase();

//   if (
//     keyword === "" &&
//     location === "" &&
//     selectedCategories.size === 0
//   ) {
//     renderJobs(jobs);
//     return;
//   }

//   const filtered = jobs.filter(job => {
//     const matchesKeyword =
//       keyword === "" ||
//       job.title.toLowerCase().includes(keyword) ||
//       job.companyName.toLowerCase().includes(keyword);

//     const matchesLocation =
//       location === "" ||
//       job.location.toLowerCase().includes(location) ||
//       job.companyAddress.city.toLowerCase().includes(location);

//     const matchesCategory =
//       selectedCategories.size === 0 ||
//       selectedCategories.has(job.category);

//     return matchesKeyword && matchesLocation && matchesCategory;
//   });

//   renderJobs(filtered);
// }


// const categoryContainer = document.getElementById("categoryOptions");
// const searchBtn = document.getElementById("searchBtn");
// const keywordInput = document.getElementById("searchKeyword");
// const locationInput = document.getElementById("searchLocation");

// let jobs = [];                 // ✅ GLOBAL SOURCE OF TRUTH
// const selectedCategories = new Set();

// /* =========================
//    INITIAL LOAD
// ========================= */
// fetchJobs();

// /* =========================
//    FETCH ALL JOBS
// ========================= */
// async function fetchJobs() {
//   try {
//     const res = await fetch("/company/jobs");
//     const data = await res.json();

//     if (!data.success) {
//       throw new Error("Failed to load jobs");
//     }

//     jobs = data.jobs;

//     renderJobs(jobs);
//     renderCategories(jobs);

//   } catch (error) {
//     console.error(error);
//     document.getElementById("jobsContainer").innerHTML =
//       "<p class='text-center text-red-500'>Failed to load jobs</p>";
//   }
// }

// /* =========================
//    CATEGORY CHIPS
// ========================= */
// function renderCategories(jobs) {
//   categoryContainer.innerHTML = "";

//   const categories = [...new Set(jobs.map(j => j.category).filter(Boolean))];

//   categories.forEach(cat => {
//     const chip = document.createElement("div");
//     chip.className =
//       "rounded-full border px-6 py-2 cursor-pointer text-gray-500";

//     chip.innerText = cat;

//     chip.onclick = () => {
//       if (selectedCategories.has(cat)) {
//         selectedCategories.delete(cat);
//         chip.classList.remove("bg-black", "text-white");
//       } else {
//         selectedCategories.add(cat);
//         chip.classList.add("bg-black", "text-white");
//       }
//       applyFilters();
//     };

//     categoryContainer.appendChild(chip);
//   });
// }

// /* =========================
//    SEARCH EVENTS
// ========================= */
// searchBtn.addEventListener("click", applyFilters);
// keywordInput.addEventListener("input", applyFilters);
// locationInput.addEventListener("input", applyFilters);

// /* =========================
//    APPLY FILTERS
// ========================= */
// function applyFilters() {
//   const keyword = keywordInput.value.trim().toLowerCase();
//   const location = locationInput.value.trim().toLowerCase();

//   const filtered = jobs.filter(job => {
//     const matchesKeyword =
//       keyword === "" ||
//       job.title?.toLowerCase().includes(keyword) ||
//       job.companyName?.toLowerCase().includes(keyword);

//     const matchesLocation =
//       location === "" ||
//       job.location?.toLowerCase().includes(location) ||
//       job.companyAddress?.city?.toLowerCase().includes(location);

//     const matchesCategory =
//       selectedCategories.size === 0 ||
//       selectedCategories.has(job.category);

//     return matchesKeyword && matchesLocation && matchesCategory;
//   });

//   renderJobs(filtered);
// }


// search.js

// const categoryContainer = document.getElementById("categoryOptions");
const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("searchKeyword");
const locationInput = document.getElementById("searchLocation");

// ❌ DO NOT redeclare jobs
// let jobs = [];

// ✅ Use shared global state
const selectedCategories = new Set();

/* =========================
   WAIT UNTIL JOBS LOADED
========================= */
document.addEventListener("jobsLoaded", () => {
  renderCategories(window.jobs);
});

/* =========================
   CATEGORY CHIPS
========================= */
function renderCategories(jobs) {
  if (!categoryContainer) return;

  categoryContainer.innerHTML = "";

  const categories = [...new Set(
    jobs.map(j => j.category).filter(Boolean)
  )];

  categories.forEach(cat => {
    const chip = document.createElement("div");
    chip.className =
      "rounded-full border px-6 py-2 cursor-pointer text-gray-500";

    chip.innerText = cat;

    chip.onclick = () => {
      if (selectedCategories.has(cat)) {
        selectedCategories.delete(cat);
        chip.classList.remove("bg-black", "text-white");
      } else {
        selectedCategories.add(cat);
        chip.classList.add("bg-black", "text-white");
      }

      applyFilters();
    };

    categoryContainer.appendChild(chip);
  });
}

/* =========================
   SEARCH EVENTS
========================= */
if (searchBtn) searchBtn.addEventListener("click", applyFilters);
if (keywordInput) keywordInput.addEventListener("input", applyFilters);
if (locationInput) locationInput.addEventListener("input", applyFilters);

/* =========================
   APPLY FILTERS
========================= */
function applyFilters() {
  if (!window.jobs) return;

  const keyword = keywordInput?.value.trim().toLowerCase() || "";
  const location = locationInput?.value.trim().toLowerCase() || "";

  const filtered = window.jobs.filter(job => {
    const matchesKeyword =
      keyword === "" ||
      job.title?.toLowerCase().includes(keyword) ||
      job.companyName?.toLowerCase().includes(keyword);

    const matchesLocation =
      location === "" ||
      job.location?.toLowerCase().includes(location) ||
      job.companyAddress?.city?.toLowerCase().includes(location);

    const matchesCategory =
      selectedCategories.size === 0 ||
      selectedCategories.has(job.category);

    return matchesKeyword && matchesLocation && matchesCategory;
  });

  renderJobs(filtered);
}
