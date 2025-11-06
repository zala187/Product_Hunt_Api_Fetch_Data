export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const monthParam = url.searchParams.get("month");
    const tradingParam = url.searchParams.get("trading");
    const latestParam = url.searchParams.get("latest");

    // 🌍 Allow CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // ✅ 1️⃣ Month data (priority)
    if (monthParam) {
      const data = await fetchMonthData(env, monthParam);
      return jsonResponse({ type: "month", ...data });
    }

    // ✅ 2️⃣ Trading (Trending) data
    if (tradingParam === "true") {
      const data = await fetchPosts(env, "VOTES");
      return jsonResponse({ type: "trading", products: data });
    }

    // ✅ 3️⃣ Latest (default)
    if (latestParam === "true" || (!monthParam && !tradingParam)) {
      const data = await fetchPosts(env, "NEWEST");
      return jsonResponse({ type: "latest", products: data });
    }

    // ❌ Fallback if no valid params
    return jsonResponse({
      message: "Please provide ?month=YYYY-MM or ?trading=true or ?latest=true",
    });
  },
};

// 🧾 Helper function to return JSON + enable CORS
function jsonResponse(data) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// 📅 Month-wise Data Fetch
async function fetchMonthData(env, monthParam) {
  const [year, month] = monthParam.split("-");
  const monthStart = new Date(year, month - 1, 1).toISOString();
  const monthEnd = new Date(year, month, 0, 23, 59, 59).toISOString();

  const query = `
    query {
      posts(order: NEWEST, postedAfter: "${monthStart}", postedBefore: "${monthEnd}", first: 50) {
        edges {
          node {
            name
            tagline
            description
            votesCount
            website
            thumbnail { url }
            reviewsRating
            media { videoUrl }
            user {
              name
              profileImage
            }
            topics(first: 3) { edges { node { name } } }
          }
        }
      }
    }`;

  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PRODUCT_HUNT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  const edges = json.data.posts.edges;

  return {
    month: monthParam,
    totalProducts: edges.length,
    products: edges.map(e => e.node),
  };
}

// 🚀 Latest / Trading Data Fetcher (Reusable)
async function fetchPosts(env, orderType) {
  const query = `
    query {
      posts(order: ${orderType}, first: 50) {
        edges {
          node {
            name
            tagline
            description
            votesCount
            website
            thumbnail { url }
            reviewsRating
            media { videoUrl }
            user {
              name
              profileImage
            }
            topics(first: 3) { edges { node { name } } }
          }
        }
      }
    }`;

  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PRODUCT_HUNT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json.data.posts.edges.map(e => e.node);
}
