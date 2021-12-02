import time
import hmac
#import requests
from requests import Request, Session
import json

s = Session()

ts = int(time.time() * 1000)
request = Request('GET', 'https://ftx.com/api/nft/all_trades')
prepared = request.prepare()
signature_payload = f'{ts}{prepared.method}{prepared.path_url}'
if prepared.body:
  signature_payload += prepared.body
  print(prepared.body)
signature_payload = signature_payload.encode()
print(signature_payload)
signature = hmac.new('FTX_API_SECRET'.encode(), signature_payload, 'sha256').hexdigest()
print(signature)
request.headers['FTX-KEY'] = 'FTX_API_KEY'
request.headers['FTX-SIGN'] = signature
request.headers['FTX-TS'] = str(ts)

request.params = {'start_time': 1635859857, 'end_time': 1636119057}

res = s.send(prepared)
with open("data.json", "w") as f:
  json.dump(res.json(), f)
