const form = document.getElementById("applyForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");

const params = new URLSearchParams(window.location.search);
const jobId = params.get("jobId");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  btnText.textContent = "Submitting...";
  loader.classList.remove("hidden");

  const formData = new FormData(form);
  formData.append("jobId", jobId);

  try {
    const res = await fetch("/api/user/apply", {method: "POST", body: formData, credentials: "include"});
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Apply failed");
    }

    alert("Applied successfully!");
    window.location.href = "/";

  } catch (err) {
    console.error(err);
    alert(err.message || "Something went wrong");

    submitBtn.disabled = false;
    btnText.textContent = "Submit Application";
    loader.classList.add("hidden");
  }
});
