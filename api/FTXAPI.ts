import { hmac } from "https://deno.land/x/crypto/hmac.ts";
import { createHash } from "https://deno.land/std@0.77.0/hash/mod.ts";
import { apiKey, apiSecret } from "./secrets.js";
import { uintToHex } from "./util.ts";

export async function getNFTTrades(): Promise<any>{
  const requestUrl = 'https://ftx.com/api/nft/all_trades';
  const requestMethod = 'GET';
  const encoder = new TextEncoder();
  const ts = + new Date();
  const hash = createHash("sha256");

  // Encode timestamp, request method and url using apiSecret as key
  var signaturePayload = `${ts}${requestMethod}${requestUrl}`;
  var signaturePayloadEncoded = encoder.encode(signaturePayload);
  var apiSecretEncoded = encoder.encode(apiSecret)
  var signature = uintToHex(hmac('sha256', apiSecretEncoded, signaturePayloadEncoded));

  // Build and send request
  const request = new Request(requestUrl, {
    method: requestMethod,
    headers: {
      'FTX-KEY': apiKey,
      'FTX-SIGN': signature,
      'FTX-TS': ts.toString(),
    }});

  const ftxResponse = async (): Promise<any> => {
    const response = await fetch(request);
    return response.json();
  }

  return ftxResponse;
}
