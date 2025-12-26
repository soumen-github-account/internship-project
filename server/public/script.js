
document.addEventListener("DOMContentLoaded", () => {
  async function loadUser() {
    try {
      const authButtons = document.getElementById("auth-buttons");
      const userInfo = document.getElementById("user-info");
      const usernameEl = document.getElementById("username");

      const mobileAuth = document.getElementById("mobile-auth-buttons");
      const mobileUser = document.getElementById("mobile-user-info");
      if (!authButtons && !userInfo) return;

      const res = await fetch("/api/user/get-user", {
        credentials: "include"
      });

      if (!res.ok) {
        
        userInfo && (userInfo.style.display = "none");

        mobileAuth && mobileAuth.classList.remove("hidden");
        mobileUser && mobileUser.classList.add("hidden");
        return;
      }

      const data = await res.json();

      usernameEl && (usernameEl.innerText = data.user.name);
      authButtons && (authButtons.style.display = "none");

      mobileAuth && mobileAuth.classList.add("hidden");
      mobileUser && mobileUser.classList.remove("hidden");
    } catch (err) {
      console.error("Load user failed:", err);
    }
  }

  loadUser();

  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("mobileLogoutBtn")?.addEventListener("click", logout);

  async function logout() {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "/";
  }

  
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value;
      const email = document.getElementById("email")?.value;
      const password = document.getElementById("password")?.value;

      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    });
  }


  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email")?.value;
      const password = document.getElementById("password")?.value;

      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    });
  }

});

async function getAllJobs() {
  try {
    renderSkeletons(6);
    const res = await fetch("/company/jobs");
    const data = await res.json();

    if (!data.success) throw new Error("Fetch failed");

    window.jobs = data.jobs;

    renderJobs(window.jobs);
    renderCategories(window.jobs);

    document.dispatchEvent(new Event("jobsLoaded"));

  } catch (err) {
    console.error(err);
    const jc = document.getElementById("jobsContainer");
    if (jc) {
      jc.innerHTML =
        "<p class='text-red-500 text-center'>Failed to load jobs</p>";
    }
  }
}

getAllJobs();


function renderSkeletons(count = 6) {
  if (!window.jobsContainer) return;

  window.jobsContainer.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className =
      "flex flex-col items-center justify-center rounded-lg bg-[#FDE7E7] p-2 animate-pulse";

    skeleton.innerHTML = `
      <div class="bg-white w-full rounded-md p-3 space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200"></div>
          <div class="h-4 w-32 bg-gray-200 rounded"></div>
        </div>

        <div class="border-t pt-3 space-y-2">
          <div class="h-4 w-3/4 bg-gray-200 rounded"></div>

          <div class="space-y-1">
            <div class="h-3 w-1/2 bg-gray-200 rounded"></div>
            <div class="h-3 w-2/3 bg-gray-200 rounded"></div>
            <div class="h-3 w-1/3 bg-gray-200 rounded"></div>
            <div class="h-3 w-1/2 bg-gray-200 rounded"></div>
          </div>

          <div class="h-9 w-full bg-gray-300 rounded-full mt-3"></div>
        </div>
      </div>
    `;

    window.jobsContainer.appendChild(skeleton);
  }
}

