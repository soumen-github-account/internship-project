
const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("searchKeyword");
const locationInput = document.getElementById("searchLocation");

const selectedCategories = new Set();

document.addEventListener("jobsLoaded", () => {
  renderCategories(window.jobs);
});

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

if (searchBtn) searchBtn.addEventListener("click", applyFilters);
if (keywordInput) keywordInput.addEventListener("input", applyFilters);
if (locationInput) locationInput.addEventListener("input", applyFilters);

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
