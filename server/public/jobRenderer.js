
// 🔹 SHARED DOM REFERENCES (DECLARE ONCE)
window.jobsContainer = document.getElementById("jobsContainer");
window.categoryContainer = document.getElementById("categoryOptions");

// 🔹 SHARED STATE
window.jobs = [];

/* ===============================
   RENDER JOBS
================================ */
window.renderJobs = function (list) {
  if (!jobsContainer) return;

  jobsContainer.innerHTML = "";

  if (!list || list.length === 0) {
    jobsContainer.innerHTML =
      `<p class="text-center text-gray-500">No jobs found</p>`;
    return;
  }

  list.forEach(job => {
    const card = document.createElement("div");
    card.className =
      "flex flex-col items-center justify-center rounded-lg bg-[#FDE7E7] p-2";

    card.innerHTML = `
      <div class="bg-white w-full rounded-md p-3">
        <a href="/company/jobs/${job.jobId}">
          <div class="flex items-center gap-2 cursor-pointer">
            <img src="${job.companyLogo}" class="w-10 h-10 rounded-full border">
            <p class="font-semibold">${job.companyName}</p>
          </div>
        </a>
        <div class="border-t mt-3 pt-2 text-sm">
          <p class="font-medium mt-2">${job.title}</p>
          <div class="flex flex-col gap-1 mt-2">
          <span class="flex items-center gap-2"><i class="fi fi-sr-map-pin"></i> <p>${job.location}</p></span>
          <span class="flex items-center gap-2"><i class="fi fi-sr-clock-three"></i> <p>Duration: ${job.duration}</p></span>
          <span class="flex items-center gap-2"><i class="fi fi-ss-briefcase"></i> <p>Type: ${job.jobType}</p></span>
          <span class="flex items-center gap-2"><i class="fi fi-sr-usd-circle"></i> <p>Stipend: ${job.stipend}</p></span>
          </div>
          <button onclick="applyJob('${job.jobId}')"
            class="w-full bg-black text-white rounded-full mt-3 p-2">
            Apply
          </button>
        </div>
      </div>
    `;

    jobsContainer.appendChild(card);
  });
};

/* ===============================
   RENDER CATEGORIES
================================ */
window.renderCategories = function (jobs) {
  if (!categoryContainer) return;

  categoryContainer.innerHTML = "";

  const categories = [...new Set(jobs.map(j => j.category).filter(Boolean))];

  categories.forEach(cat => {
    const chip = document.createElement("div");
    chip.className =
      "rounded-full border px-6 py-2 cursor-pointer text-gray-500";

    chip.innerText = cat;

    chip.onclick = () => {
      chip.classList.toggle("bg-black");
      chip.classList.toggle("text-white");
      document.dispatchEvent(new Event("applyFilters"));
    };

    categoryContainer.appendChild(chip);
  });
};

// // /* ===== NAV ===== */
// function openJob(jobId) {
//   window.location.href = `/job.html?id=${jobId}`;
// }

function applyJob(jobId) {
  window.location.href = `/apply.html?jobId=${jobId}`;
}
