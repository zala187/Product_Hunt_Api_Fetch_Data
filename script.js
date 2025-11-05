// async function latestfetchData() {
//   const productList = document.getElementById("productList");
//   productList.innerHTML = '<p class="spinner">Loading...</p>';

//   try {
//     const res = await fetch(`https://product-hunt-worker.manishzala1718.workers.dev/`);

//     if (!res.ok) throw new Error("Failed to fetch latest data");

//     const data = await res.json();
//     productList.innerHTML = "";

//     const latestList = data.latest || [];

//     latestList.forEach(p => {
//       const div = document.createElement("div");
//       div.className = "card p-3 shadow-sm text-center";
//       div.style.width = "18rem";
//       div.innerHTML = `
//         <div class="product-card">
//           <a href="product.html?id=${encodeURIComponent(p.name)}" class="card-link text-decoration-none text-dark">
//             <img src="${p.thumbnail?.url || 'default.jpg'}" class="img-fluid rounded-top" style="height:200px;object-fit:cover;" />
//             <h5 class="mt-3 fw-bold">${p.name}</h5>
//             <p class="text-muted">${p.tagline}</p>
//             <p class="icon-count"><span class="material-symbols-outlined">mode_comment</span> ${p.votesCount}</p>
//           </a>
//           <a href="${p.website}" target="_blank" class="btn btn-outline-primary mt-2">Visit</a>
//         </div>
//       `;

//       productList.appendChild(div);

//       // Save product details in localStorage
//       div.querySelector(".card-link").addEventListener("click", () => {
//         localStorage.setItem("selectedProduct", JSON.stringify(p));
//       });
//     });
//   } catch (error) {
//     productList.innerHTML = "<p class='text-danger'>⚠️ Error loading data.</p>";
//     console.error(error);
//   }
// }

// // Run on page load
// window.addEventListener("DOMContentLoaded", latestfetchData);



async function fetchMonthlyData() {
  const month = document.getElementById("monthPicker").value;
  if (!month) return alert("Please select a month first!");

  const productList = document.getElementById("productList");
  productList.innerHTML = '<p class="spinner"></p>';

  try {
    const res = await fetch(`https://product-hunt-worker.manishzala1718.workers.dev/?month=${month}`);
    if (!res.ok) throw new Error("Failed to fetch monthly data");

    const data = await res.json();
    productList.innerHTML = "";

    data.products.forEach(p => {
      const div = document.createElement("div");
      div.className = "card";
     div.innerHTML = `
  <div class="product-card">
    <a href="product.html?id=${encodeURIComponent(p.name)}" class="card-link">
      <img src="${p.thumbnail?.url || ''}" class="img-fluid rounded-top object-fit-cover" />
      <h3>${p.name}</h3>
      <p>${p.tagline}</p>
      <p class="icon-count"><span class="material-symbols-outlined">mode_comment</span>${p.votesCount}</p>
    </a>
  </div>
`;

      productList.appendChild(div);
       div.querySelector(".card-link").addEventListener("click", () => {
    localStorage.setItem("selectedProduct", JSON.stringify(p));
  });
    });
  } catch (error) {
    productList.innerHTML = "<p>Error loading monthly data.</p>";
    console.error(error);
  }
}

window.addEventListener("load", () => {
  const savedData = localStorage.getItem("monthData");
  const savedMonth = localStorage.getItem("selectedMonth");

  if (savedData && savedMonth) {
    document.getElementById("monthPicker").value = savedMonth;
    const data = JSON.parse(savedData);

    // Render same data again (use your existing display code)
    document.getElementById("summary").innerHTML = `
      <h2>${data.month}</h2>
      <p>Total Products: ${data.products.length}</p>
    `;
    // aur yaha apne display logic ko firse run kar do
  }
});

async function latestfetchData() {
  const productList = document.getElementById("productList");
  const summary = document.getElementById("summary");

  productList.innerHTML = '<div class="spinner"></div>';
  summary.innerHTML = "";

  try {
    const res = await fetch("https://product-hunt-worker.manishzala1718.workers.dev/");
    if (!res.ok) throw new Error("Failed to fetch latest data");

    const data = await res.json();
    productList.innerHTML = "";

    summary.innerHTML = `
      <h3>🔥 Latest Product Hunt Launches</h2>
      <p>Total Products: ${data.products.length}</p>
    `;

    data.products.forEach((post, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${index + 1}. ${post.name}</h3>
        <p>${post.tagline}</p>
        <img src="${post.thumbnail.url}" alt="${post.name}">
        <p>⭐ ${post.votesCount} votes</p>
        <a href="${post.website}" target="_blank">Visit →</a>
      `;
      productList.appendChild(card);
    });

  } catch (error) {
    productList.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}


window.onload = latestfetchData;

async function tradingfetchData() {
  const productList = document.getElementById("productList");
  const summary = document.getElementById("summary");

  productList.innerHTML = '<div class="spinner"></div>';
  summary.innerHTML = "";

  try {
    const res = await fetch("https://product-hunt-worker.manishzala1718.workers.dev/");
    if (!res.ok) throw new Error("Failed to fetch latest data");

    const data = await res.json();
    productList.innerHTML = "";

    summary.innerHTML = `
      <h3>🔥 Trading Product Hunt Launches</h2>
      <p>Total Products: ${data.products.length}</p>
    `;

    data.products.forEach((post, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${index + 1}. ${post.name}</h3>
        <p>${post.tagline}</p>
        <img src="${post.thumbnail.url}" alt="${post.name}">
        <p>⭐ ${post.votesCount} votes</p>
        <a href="${post.website}" target="_blank">Visit →</a>
      `;
      productList.appendChild(card);
    });

  } catch (error) {
    productList.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}


window.onload = tradingfetchData;



const toggler = document.getElementById("themeToggler");
const themeIcon = document.getElementById("themeIcon");

toggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeIcon.textContent = "dark_mode";
  } else {
    themeIcon.textContent = "light_mode";
  }
});
const restoggler = document.getElementById("resToggler");
const resthemeIcon = document.getElementById("resthemeIcon");

restoggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    resthemeIcon.textContent = "dark_mode";
  } else {
    resthemeIcon.textContent = "light_mode";
  }
});

function clearData() {
  localStorage.removeItem("monthData");
  localStorage.removeItem("selectedMonth");
  alert("Data cleared!");
}