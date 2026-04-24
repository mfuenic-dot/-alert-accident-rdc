import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2.47.10";

const app = new Hono();

// Supabase client for storage and database operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize storage buckets on startup
async function initializeStorage() {
  const bucketName = 'make-5ba3ef6c-accident-media';

  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

  if (!bucketExists) {
    console.log(`Creating bucket: ${bucketName}`);
    await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 52428800, // 50MB
    });
  }
}

// Initialize storage
initializeStorage().catch(console.error);

// Health check endpoint
app.get("/make-server-5ba3ef6c/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== COMMUNES ENDPOINTS ====================

// Get all communes
app.get("/make-server-5ba3ef6c/communes", async (c) => {
  try {
    const communes = await kv.get('communes');

    if (!communes) {
      return c.json({ error: 'Communes not initialized' }, 404);
    }

    return c.json(communes);
  } catch (error) {
    console.log(`Error fetching communes: ${error}`);
    return c.json({ error: 'Failed to fetch communes' }, 500);
  }
});

// Initialize communes data (one-time setup)
app.post("/make-server-5ba3ef6c/communes/init", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set('communes', body.communes);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error initializing communes: ${error}`);
    return c.json({ error: 'Failed to initialize communes' }, 500);
  }
});

// ==================== OPJ ENDPOINTS ====================

// Get all OPJ
app.get("/make-server-5ba3ef6c/opj", async (c) => {
  try {
    const opjList = await kv.getByPrefix('opj:');
    return c.json(opjList);
  } catch (error) {
    console.log(`Error fetching OPJ list: ${error}`);
    return c.json({ error: 'Failed to fetch OPJ list' }, 500);
  }
});

// Get OPJ by commune and quartier
app.get("/make-server-5ba3ef6c/opj/:commune/:quartier", async (c) => {
  try {
    const { commune, quartier } = c.req.param();
    const allOpj = await kv.getByPrefix('opj:');

    const filtered = allOpj.filter((opj: any) =>
      opj.commune === commune && opj.quartier === quartier
    );

    return c.json(filtered);
  } catch (error) {
    console.log(`Error fetching OPJ by location: ${error}`);
    return c.json({ error: 'Failed to fetch OPJ' }, 500);
  }
});

// Update OPJ availability
app.put("/make-server-5ba3ef6c/opj/:id/availability", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const opj = await kv.get(`opj:${id}`);
    if (!opj) {
      return c.json({ error: 'OPJ not found' }, 404);
    }

    const updatedOpj = {
      ...opj,
      isAvailable: body.isAvailable,
      lastSeen: new Date().toISOString(),
    };

    await kv.set(`opj:${id}`, updatedOpj);
    return c.json(updatedOpj);
  } catch (error) {
    console.log(`Error updating OPJ availability: ${error}`);
    return c.json({ error: 'Failed to update OPJ availability' }, 500);
  }
});

// Initialize OPJ data (one-time setup)
app.post("/make-server-5ba3ef6c/opj/init", async (c) => {
  try {
    const body = await c.req.json();
    const opjList = body.opjList || [];

    for (const opj of opjList) {
      await kv.set(`opj:${opj.id}`, {
        ...opj,
        lastSeen: opj.lastSeen || new Date().toISOString(),
      });
    }

    return c.json({ success: true, count: opjList.length });
  } catch (error) {
    console.log(`Error initializing OPJ data: ${error}`);
    return c.json({ error: 'Failed to initialize OPJ data' }, 500);
  }
});

// ==================== ACCIDENT REPORTS ENDPOINTS ====================

// Create accident report
app.post("/make-server-5ba3ef6c/reports", async (c) => {
  try {
    const body = await c.req.json();

    const reportId = `report:${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const report = {
      id: reportId,
      ...body,
      timestamp: new Date().toISOString(),
      status: 'submitted',
      mediaUrls: [], // Will be populated after file uploads
    };

    await kv.set(reportId, report);
    return c.json(report);
  } catch (error) {
    console.log(`Error creating accident report: ${error}`);
    return c.json({ error: 'Failed to create accident report' }, 500);
  }
});

// Get all accident reports
app.get("/make-server-5ba3ef6c/reports", async (c) => {
  try {
    const reports = await kv.getByPrefix('report:');
    return c.json(reports);
  } catch (error) {
    console.log(`Error fetching accident reports: ${error}`);
    return c.json({ error: 'Failed to fetch accident reports' }, 500);
  }
});

// Get accident report by ID
app.get("/make-server-5ba3ef6c/reports/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const report = await kv.get(`report:${id}`);

    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    return c.json(report);
  } catch (error) {
    console.log(`Error fetching accident report: ${error}`);
    return c.json({ error: 'Failed to fetch accident report' }, 500);
  }
});

// Update accident report status
app.put("/make-server-5ba3ef6c/reports/:id/status", async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();

    const report = await kv.get(`report:${id}`);
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    const updatedReport = {
      ...report,
      status: body.status,
    };

    await kv.set(`report:${id}`, updatedReport);
    return c.json(updatedReport);
  } catch (error) {
    console.log(`Error updating accident report status: ${error}`);
    return c.json({ error: 'Failed to update report status' }, 500);
  }
});

// ==================== MEDIA UPLOAD ENDPOINTS ====================

// Upload media file (photo or audio)
app.post("/make-server-5ba3ef6c/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const reportId = formData.get('reportId') as string;
    const fileType = formData.get('fileType') as string; // 'photo' or 'audio'

    if (!file || !reportId) {
      return c.json({ error: 'Missing file or reportId' }, 400);
    }

    const bucketName = 'make-5ba3ef6c-accident-media';
    const fileExt = file.name.split('.').pop();
    const fileName = `${reportId}/${fileType}-${Date.now()}.${fileExt}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.log(`Storage upload error: ${error.message}`);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }

    // Create signed URL (valid for 7 days)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 604800);

    return c.json({
      success: true,
      fileName,
      path: data.path,
      signedUrl: signedUrlData?.signedUrl,
    });
  } catch (error) {
    console.log(`Error uploading media file: ${error}`);
    return c.json({ error: 'Failed to upload media file' }, 500);
  }
});

// Get signed URL for a media file
app.get("/make-server-5ba3ef6c/media/:reportId/:fileName", async (c) => {
  try {
    const { reportId, fileName } = c.req.param();
    const bucketName = 'make-5ba3ef6c-accident-media';
    const filePath = `${reportId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 604800); // 7 days

    if (error) {
      console.log(`Error creating signed URL: ${error.message}`);
      return c.json({ error: 'Failed to create signed URL' }, 500);
    }

    return c.json({ signedUrl: data.signedUrl });
  } catch (error) {
    console.log(`Error getting media file: ${error}`);
    return c.json({ error: 'Failed to get media file' }, 500);
  }
});

// ==================== WHATSAPP NOTIFICATION ENDPOINT ====================

// Send WhatsApp notification to OPJ
app.post("/make-server-5ba3ef6c/notify-opj", async (c) => {
  try {
    const body = await c.req.json();
    const { opjWhatsappNumber, reportId, message, commune, quartier } = body;

    // Get WhatsApp API credentials from environment
    const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');

    if (!whatsappApiKey) {
      console.log('WhatsApp API key not configured');
      return c.json({
        error: 'WhatsApp API not configured. Please add WHATSAPP_API_KEY in Supabase settings.'
      }, 500);
    }

    // Log the notification attempt (replace with actual API call when ready)
    console.log(`WhatsApp notification to ${opjWhatsappNumber}:`, message);
    console.log(`Report ID: ${reportId}, Location: ${commune} - ${quartier}`);

    // TODO: Implement actual WhatsApp API call here
    // Example for Twilio:
    // const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    // const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    // const twilioWhatsappNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

    // For now, return mock success
    return c.json({
      success: true,
      message: 'Notification logged (WhatsApp integration pending)',
      recipientNumber: opjWhatsappNumber,
      reportId,
    });
  } catch (error) {
    console.log(`Error sending WhatsApp notification: ${error}`);
    return c.json({ error: 'Failed to send WhatsApp notification' }, 500);
  }
});

Deno.serve(app.fetch);