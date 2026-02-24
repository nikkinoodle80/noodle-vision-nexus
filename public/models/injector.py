# injector.py
import os, json, csv, glob, time, argparse, requests

DEFAULT_LOCAL_DIR = r"C:\Users\nicol\Build\work\data"
DEFAULT_ENDPOINT = "http://localhost:5000"
MAX_RECORDS = 2000

def load_json_file(path):
    with open(path, "r", encoding="utf-8") as f: return json.load(f)
def load_csv_file(path):
    rows=[]
    with open(path, "r", encoding="utf-8") as f:
        reader=csv.DictReader(f)
        for r in reader: rows.append(r)
    return rows
def discover_local_results(local_dir):
    results=[]
    if not os.path.isdir(local_dir): print(f"[WARN] Local dir not found: {local_dir}"); return results
    for ext in ("*.json","*.ndjson","*.csv"):
        for p in glob.glob(os.path.join(local_dir,ext)):
            try:
                data=load_csv_file(p) if p.lower().endswith(".csv") else load_json_file(p)
                if isinstance(data,str): data=json.loads(data)
                results.extend(data) if isinstance(data,list) else results.append(data)
                print(f"[INFO] Loaded {len(data) if hasattr(data,'__len__') else 1} records from {p}")
            except Exception as e: print(f"[ERROR] Failed to load {p}: {e}")
            if len(results)>=MAX_RECORDS: return results[:MAX_RECORDS]
    return results[:MAX_RECORDS]
def record_to_payloads(record):
    out=[]
    keys={k.lower():k for k in record.keys()} if isinstance(record,dict) else {}
    scene_key=keys.get("scene") or keys.get("scene_name")
    if scene_key: out.append(("scene",{"scene":str(record.get(scene_key))})); return out
    trigger_key=keys.get("type") or keys.get("trigger") or keys.get("trigger_type")
    if trigger_key:
        payload={"type":str(record.get(trigger_key))}
        for meta in ("device_id","adapter_id","latency","hotspot","badge","wowShockIndex","severity","value"):
            if meta in record: payload[meta]=record[meta]
        payload["meta"]={k:record[k] for k in record if k not in payload}
        out.append(("trigger",payload))
        return out
    known_fields=["hotspot","latency","adapter","badge","wowshockindex","device","port","signal"]
    if any(k in keys for k in known_fields): out.append(("trigger",{"type":"data_event","meta":record})); return out
    out.append(("trigger",{"type":"generic_result","meta":record})); return out
def post_to_endpoint(base,endpoint,payload,timeout=5):
    url=base.rstrip("/")+ "/" + endpoint.lstrip("/")
    try:
        r=requests.post(url,json=payload,timeout=timeout)
        print(f"[POST] {url} -> status {r.status_code}")
        try: print("  response:",r.text.strip())
        except: pass
        return True
    except Exception as e: print(f"[ERROR] POST {url} failed: {e}"); return False
def main(args):
    results=discover_local_results(args.local_dir)
    if not results: print("[WARN] No results found."); return
    print(f"[INFO] Using {len(results)} records. Beginning injection to {args.endpoint}")
    sent=0
    for i,rec in enumerate(results):
        if i>=args.limit: print(f"[INFO] Reached user limit ({args.limit}). Stopping."); break
        if isinstance(rec,str):
            try: rec=json.loads(rec)
            except: rec={"value":rec}
        if not isinstance(rec,dict):
            try: rec=dict(rec)
            except: rec={"value":rec}
        for endpoint,payload in record_to_payloads(rec):
            if post_to_endpoint(args.endpoint,endpoint,payload): sent+=1
            time.sleep(args.delay)
    print(f"[DONE] Sent {sent} POSTs total. Injector finished.")

if __name__=="__main__":
    parser=argparse.ArgumentParser(description="Noodle-VISION MCP-safe injector (console-only).")
    parser.add_argument("--local-dir",type=str,default=DEFAULT_LOCAL_DIR)
    parser.add_argument("--endpoint",type=str,default=DEFAULT_ENDPOINT)
    parser.add_argument("--limit",type=int,default=MAX_RECORDS)
    parser.add_argument("--delay",type=float,default=0.05)
    main(parser.parse_args())
