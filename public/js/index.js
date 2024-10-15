// conn = new WebSocket("ws://" + document.location.host + "/ws");
// conn.onclose = function (evt) {
//   console.log("Connection Closed")
//   setTimeout(function () {
//     location.reload();
//   }, 2000);
// };

// console.log('wow')
//
//
function isLabelingCode() {
  const labels = [];
  let currentTask = 1;
  const completedTasks = 0;
  const totalTasks = 10;

  function loadTask(taskId, pushState = true) {
    currentTask = taskId;
    document.getElementById("currentImage").src =
      `/api/placeholder/800/600?text=Task ${taskId} Image`;
    clearLabels();
    updateProgress();

    // Update task list highlighting
    document.querySelectorAll("#taskList li").forEach((li) => {
      li.classList.remove("bg-blue-100");
      if (li.textContent.includes(`Task ${taskId}:`)) {
        li.classList.add("bg-blue-100");
      }
    });

    // Update URL state
    if (pushState) {
      const newUrl = `/task/${taskId}`;
      window.history.pushState({ taskId }, "", newUrl);
    }
  }

  function addLabel() {
    // ... (existing addLabel function remains the same) ...
  }

  function clearLabels() {
    // ... (existing clearLabels function remains the same) ...
  }

  function updateLabelList() {
    // ... (existing updateLabelList function remains the same) ...
  }

  function submitTask() {
    // ... (existing submitTask function remains the same) ...
  }

  function updateProgress() {
    // ... (existing updateProgress function remains the same) ...
  }

  function drag(event) {
    // ... (existing drag function remains the same) ...
  }

  // Update the onclick handlers in the HTML
  document.querySelectorAll("#taskList li").forEach((li) => {
    li.onclick = function () {
      const taskId = parseInt(
        this.textContent.split(":")[0].replace("Task ", ""),
      );
      loadTask(taskId);
    };
  });

  // Handle popstate events (browser back/forward buttons)
  window.onpopstate = function (event) {
    if (event.state && event.state.taskId) {
      loadTask(event.state.taskId, false);
    } else {
      loadTask(1, false);
    }
  };

  // Initial load based on URL
  document.addEventListener("DOMContentLoaded", function () {
    const match = window.location.pathname.match(/\/task\/(\d+)/);
    const initialTaskId = match ? parseInt(match[1]) : 1;
    loadTask(initialTaskId, false);
  });

  // ... (remaining event listeners and initializations) ...
}
setTimeout(function () {
  return;
  console.log("binding footer");
  const el = document.querySelector(".footer");
  console.log(el) /
    // if (! el.textContent.includes('tools/')) {
    //   el.textContent = ''
    //   //if its not a chosen tool, we dont render controls
    // }
    // if (window.location.pathname !== '/tools/auto-labeling') {
    //   return console.log('isLabelingCode entrypoint')
    //   //isLabelingCode()
    // }
    //
    el.addEventListener("mousemoce", () => {
      console.log("yay");
      el.classList.add("open");
    });
  el.addEventListener("mouseenter", () => {
    console.log("yay");
    el.classList.add("open");
  });
  el.addEventListener("mouseleave", () => {
    console.log("close");
    el.classList.remove("open");
  });

  el.addEventListener("click", (e) => {
    const newUrl = "/sitemap";
    console.log(newUrl);
    window.location.href = newUrl;
    // window.history.pushState({taskId: e.target.textContent}, '', newUrl);
  });
}, 500);

console.log("fullstory loaded good");
