// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Hono } from "jsr:@hono/hono";
import {
  getSupabaseClient,
  member_has_already_attended_today,
  parseFormData,
} from "./helper.ts";

const app = new Hono().basePath(`/attend`);

app.post("/", async (c) => {
  try {
    const supabase = getSupabaseClient(c.req.header("Authorization") ?? "");
    const formData = await c.req.parseBody();
    const dataParsed = parseFormData(formData);

    if (!dataParsed.success)
      return c.json(
        {
          success: false,
          error: dataParsed.error,
        },
        400,
      );

    if (
      await member_has_already_attended_today(dataParsed.data.label, supabase)
    ) {
      return c.json(
        {
          success: false,
          error: "Member Has Already Attended",
        },
        400,
      );
    }

    const uploadFile = await supabase.storage
      .from("media")
      .upload(
        `/${dataParsed.data.label}/attend/${crypto.randomUUID()}`,
        dataParsed.data.file,
      );
    if (uploadFile.error)
      return c.json(
        {
          success: false,
          error: uploadFile.error.message,
        },
        400,
      );

    await supabase.from("attendances").insert({
      profile_id: dataParsed.data.label,
      data: {
        similarity: dataParsed.data.similarity,
        image: uploadFile.data.fullPath,
      },
    });

    return c.json({ success: true });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      400,
    );
  }
});

Deno.serve(app.fetch);
