   const loader = document.getElementById("loader");
const cardContainer = document.getElementById("all-issues");
const searchInput = document.getElementById("searchInput");

const allTab = document.getElementById("all-tab");
const openTab = document.getElementById("open-tab");
const closedTab = document.getElementById("closed-tab");

const issueCount = document.getElementById("issue-count");

let issuesData = []; // store all issues
let activeTab = "all"; // default

// Fetch issues once
async function fetchIssues() {
  loader.style.display = "flex";
  try {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();
    issuesData = data.data;
    renderCards(issuesData);
  } catch (err) {
    console.error("Fetch Error:", err);
    cardContainer.innerHTML = '<p class="text-red-500">Failed to load issues.</p>';
  } finally {
    loader.style.display = "none";
  }
}

// Render cards function
function renderCards(filteredIssues) {
  cardContainer.innerHTML = "";
  issueCount.textContent = filteredIssues.length;

  filteredIssues.forEach(issue => {
    let borderColor = issue.status.toLowerCase() === "open" ? "border-t-green-500" : "border-t-purple-500";

    let priorityBg = "#EEEFF2";
    let priorityText = "#EF4444";
    if(issue.priority.toLowerCase() === "low") { priorityText = "#9CA3AF"; }
    else if(issue.priority.toLowerCase() === "medium") { priorityBg = "#FFF6D1"; priorityText = "#F59E0B"; }
    else if(issue.priority.toLowerCase() === "high") { priorityBg = "#FEECEC"; priorityText = "#EF4444"; }

    let statusImg = issue.status.toLowerCase() === "open" ? "assets/Open-Status.png" : "assets/Closed-Status.png";

    // Card HTML
    cardContainer.innerHTML += `
      <div class="shadow-md p-3 rounded-lg space-y-4 border-t-4 ${borderColor} hover:shadow-lg transition cursor-pointer" data-id="${issue.id}">
        <div class="flex justify-between items-center">
          <img class="h-7 bg-cover" src="${statusImg}" alt="">
          <p class="font-bold px-4 rounded-full py-1" style="color: ${priorityText}; background-color: ${priorityBg};">${issue.priority}</p>
        </div>
        <h2 class="font-bold text-gray-700">${issue.title}</h2>
        <p class="text-xs font-medium text-gray-500">${issue.description || ""}</p>
        <div class="flex gap-3 items-center">
          <p class="text-base font-medium flex items-center gap-1 bg-[#FEECEC] px-3 rounded-full py-1 text-[#EF4444]"><i class="fa-solid fa-bug"></i> BUG</p>
          <p class="text-base font-medium flex items-center gap-1 bg-[#FDE68A] px-4 rounded-full py-1 text-[#D97706]"><i class="fa-solid fa-life-ring"></i> HELP WANTED</p>
        </div>
        <hr>
        <div class="text-sm font-medium text-gray-500">
          <p>#1 by ${issue.author}</p>
          <p>1/15/2024</p>
        </div>
      </div>
    `;
  });

  // Card click event (same style as before)
  const cards = document.querySelectorAll("#all-issues > div");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const selected = filteredIssues.find(i => i.id == id);

      if(selected){
        document.getElementById("modal-title").textContent = selected.title;
        document.getElementById("modal-status").textContent = selected.status;
        document.getElementById("modal-author").textContent = "• Opened by " + selected.author;
        document.getElementById("modal-date").textContent = "• 22/02/2026";
        document.getElementById("modal-assignee").textContent = selected.author;
        document.getElementById("modal-priority").textContent = selected.priority;

        document.getElementById("issue-modal").showModal();

        // Open modal (DaisyUI dialog)
        document.getElementById("issue-modal").showModal();
      }
    });
  });
}

// Active tab styling
function setActiveTab(tab) {
  [allTab, openTab, closedTab].forEach(btn => {
    btn.classList.remove("bg-blue-500","text-white");
    btn.classList.add("bg-gray-100","text-black");
  });
  tab.classList.add("bg-blue-500","text-white");
  tab.classList.remove("bg-gray-100","text-black");
}

// Filter issues based on search & tab
function filterIssues() {
  const query = searchInput.value.toLowerCase();
  let filtered = issuesData.filter(issue => {
    const matchesQuery = issue.title.toLowerCase().includes(query) || (issue.description && issue.description.toLowerCase().includes(query));
    const matchesTab = (activeTab === "all") || (activeTab === "open" && issue.status.toLowerCase() === "open") || (activeTab === "closed" && issue.status.toLowerCase() === "closed");
    return matchesQuery && matchesTab;
  });
  renderCards(filtered);
}

// Tab click events
allTab.addEventListener("click", () => { activeTab="all"; setActiveTab(allTab); filterIssues(); });
openTab.addEventListener("click", () => { activeTab="open"; setActiveTab(openTab); filterIssues(); });
closedTab.addEventListener("click", () => { activeTab="closed"; setActiveTab(closedTab); filterIssues(); });

// Search input
searchInput.addEventListener("input", filterIssues);

// Initial fetch
fetchIssues();



