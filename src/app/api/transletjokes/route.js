import translate from "google-translate-api-x";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.joke) {
      return new Response(JSON.stringify({ error: "Joke text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // मज़ाक को हिंदी में ट्रांसलेट करें
    const translated = await translate(body.joke, { to: "hi" });

    return new Response(
      JSON.stringify({ translatedJoke: translated.text }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Translation API Error:", error);

    return new Response(
      JSON.stringify({ error: "Translation failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
