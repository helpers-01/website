import { serve } from "https://deno.land/std/http/server.ts";
import crypto from "https://deno.land/std/crypto/mod.ts";

serve(async (req) => {
    const webhookSecret = Deno.env.get("RAZORPAY_SECRET") || "";
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

    if (signature !== expectedSignature) {
        return new Response("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Received Payment Webhook:", event);

    if (event.event === "payment.captured") {
        const payment_id = event.payload.payment.entity.id;

        // Update Supabase DB payment status
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        const response = await fetch(`${supabaseUrl}/rest/v1/payments?razorpay_payment_id=eq.${payment_id}`, {
            method: "PATCH",
            headers: {
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: "paid" })
        });

        if (response.ok) {
            console.log("Payment status updated in DB.");
        } else {
            console.error("Failed to update DB.");
        }
    }

    return new Response("Webhook Processed", { status: 200 });
});