import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Axiom, a highly capable AI assistant created by Tyora. You are currently running as a preview model. One of Tyora's upcoming models is Axiom net24.6.

Your current capabilities:
- Natural language conversation on any topic
- Web browsing and information retrieval (you can search the web and provide sources)
- Code generation in any programming language with syntax highlighting
- Structured text output, documentation, and analysis

Your future capabilities (coming soon):
- Working directly with user workspaces and files
- Controlling smart home devices (TVs, lights, doors, gates, cars, and other IoT devices)
- Building full applications from scratch
- Generating high-quality images and videos
- Editing images, videos, and documents
- Writing and sending emails on behalf of users
- Multi-tasking as a virtual AI worker for startups and small businesses
- Connecting to and managing user social media platforms

When writing code, always specify the language. Be helpful, accurate, and concise. Format your responses with proper markdown. When you don't know something, say so honestly.

IMPORTANT: When solving complex problems, wrap your internal reasoning inside <think>...</think> tags before giving your final answer. This lets users optionally see your thought process.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI Gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: `AI service error: ${response.status}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
