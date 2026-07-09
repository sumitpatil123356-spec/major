import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const groqApiKey = process.env.GROQ_API_KEY || "";

export const scanProductWithGroq = createServerFn({ method: "POST" })
  .validator(
    z.object({
      imageBase64: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    console.log("[Groq Server Function] Invoked. Image data length:", data.imageBase64.length);

    if (!groqApiKey || groqApiKey === "gsk_your_groq_api_key_here") {
      console.log("[Groq MOCK MODE] API key is missing. Simulating analysis...");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15); // 15 days from now

      return {
        name: "Fresh Strawberry Jam",
        category: "Food",
        quantity: "340g jar",
        expiryDate: futureDate.toISOString().slice(0, 10),
        notes: "Mock AI analysis: detected Strawberry Jam container.",
      };
    }

    try {
      // Build request body for Groq Vision API
      const payload = {
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image of a product packaging, label, box, or receipt. Extract the product name, its category (must be exactly one of: 'Food', 'Medicine', 'Cosmetics', or 'Household'), quantity (e.g. 500 ml, 1 loaf, 10 tablets, 1 unit), and its estimated or printed expiry date (format: YYYY-MM-DD. If not visible, estimate a reasonable date based on the product type starting from today). Return ONLY a JSON object with keys: 'name', 'category', 'quantity', 'expiryDate', and 'notes'.",
              },
              {
                type: "image_url",
                image_url: {
                  url: data.imageBase64,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      };

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API Error (${response.status}): ${errorText}`);
      }

      const resData = await response.json();
      const content = resData.choices[0]?.message?.content;
      console.log("[Groq Response Content]:", content);

      const parsed = JSON.parse(content);
      return {
        name: parsed.name || "Unknown Product",
        category: ["Food", "Medicine", "Cosmetics", "Household"].includes(parsed.category)
          ? parsed.category
          : "Food",
        quantity: parsed.quantity || "1 unit",
        expiryDate: parsed.expiryDate || new Date().toISOString().slice(0, 10),
        notes: parsed.notes || "Analyzed by Groq Vision.",
      };
    } catch (err) {
      console.error("[Groq Error]:", err);
      throw new Error("Vision scanning failed: " + err.message);
    }
  });

export const getGroqConfigStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const isConfigured = Boolean(groqApiKey) && groqApiKey !== "gsk_your_groq_api_key_here";
    return { isConfigured };
  });

