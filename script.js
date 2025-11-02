const Api_Url = "https://api.producthunt.com/v2/api/graphql";
const Api_Key = "h01Ew3Xlb0RBjfGmVq3vfVrHEPpvQPldK0ERRdfPvhY";

async function checkHunt() {
  const response = await fetch(Api_Url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Api_Key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        {
          posts(first: 20) {
            edges {
              node {
                name
                tagline
                votesCount
                thumbnail { url }
              }
            }
          }
        }
      `,
    }),
  });

  const data = await response.json();
  const product = data.data.posts.edges;
  console.log(data);

  const productContainer = document.getElementById("productContainer");
  product.forEach(({ node }) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
    <img src= "${node.thumbnail.url}" alt="${node.name}"/>
    <h3>${node.name}</h3>
    <p>${node.tagline}</p>
     <strong>👍 ${node.votesCount} votes</strong>
    `;
    productContainer.appendChild(div);
  });
}

checkHunt();

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
