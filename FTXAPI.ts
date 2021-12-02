import { hmac } from "https://deno.land/x/crypto/hmac.ts";
import { Buffer } from "https://deno.land/std/io/mod.ts";

const request = new Request('https://ftx.com/api/nft/all_trades', {method: 'GET'});
const encoder = new TextEncoder();
const ts = + new Date();

var signaturePayload = `${ts}${request.method}${request.url}`;
var signaturePayloadEncoded = encoder.encode(signaturePayload);
var apiSecretEncoded = encoder.encode('FTX_API_SECRET')
var signature = hmac('sha256', apiSecretEncoded, signaturePayloadEncoded);
