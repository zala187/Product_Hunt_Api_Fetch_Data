
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const monthParam = url.searchParams.get("month");

    // Allow CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // If month provided => fetch dynamic data
    if (monthParam) {
      const data = await fetchMonthData(env, monthParam);
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("Please provide ?month=YYYY-MM", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  },
};

// 🧠 Function to fetch month-wise data
async function fetchMonthData(env, monthParam) {
  const [year, month] = monthParam.split("-");
  const monthStart = new Date(year, month - 1, 1).toISOString();
  const monthEnd = new Date(year, month, 0, 23, 59, 59).toISOString();

  const query = `query {
    posts(order: NEWEST, postedAfter: "${monthStart}", postedBefore: "${monthEnd}", first: 50) {
      edges {
        node {
          name
          tagline
          votesCount
          website
          thumbnail { url }
          topics(first: 3) { edges { node { name } } }
        }
      }
    }
  }`;

  const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PRODUCT_HUNT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  const edges = result.data.posts.edges;

  // Count by category
  const aiCount = edges.filter(e =>
    e.node.topics.edges.some(t => t.node.name.toLowerCase().includes("ai"))
  ).length;

  const appCount = edges.filter(e =>
    e.node.topics.edges.some(t => t.node.name.toLowerCase().includes("app"))
  ).length;

  const webCount = edges.filter(e =>
    e.node.topics.edges.some(t => t.node.name.toLowerCase().includes("web"))
  ).length;

  return {
    month: monthParam,
    totalProducts: edges.length,
    aiTools: aiCount,
    apps: appCount,
    websites: webCount,
    products: edges.map(e => e.node),
  };
}