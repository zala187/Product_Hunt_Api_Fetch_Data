// async function checkHunt() {
//   try {
//     const response = await fetch(Api_Url, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${Api_Key}`,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         query: `
//           {
//             posts(first: 20) {
//               edges {
//                 node {
//                   name
//                   tagline
//                   votesCount
//                   website
//                    topics { edges { node { name } } }
//                   thumbnail { url }
//                 }
//               }
//             }
//           }
//         `,
//       }),
//     });

//     if (!response.ok) throw new Error("Failed to fetch data");

//     const data = await response.json();
//     const product = data.data.posts.edges;

//     const productContainer = document.getElementById("productContainer");
//     productContainer.innerHTML = ""; // clear old data

//     product.forEach(({ node }) => {
//       const div = document.createElement("div");
//       div.className = "card";
//       div.innerHTML = `
//         <img src="${node.thumbnail.url}" alt="${node.name}" />
//         <h3>${node.name}</h3>
//         <p>${node.tagline}</p>
//         <strong>👍 ${node.votesCount} votes</strong>
//       `;
//       productContainer.appendChild(div);
//     });
//   } catch (error) {
//     console.error("Error fetching Product Hunt data:", error);
//   }
// }


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






