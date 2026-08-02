import json
from pathlib import Path

path = Path(r'c:/Users/abera/Downloads/BeePro.postman_collection_module123.json')
data = json.loads(path.read_text(encoding='utf-8'))
endpoints = []

def walk(item):
    if 'request' in item:
        req = item['request']
        url = req.get('url', {})
        raw = url.get('raw')
        if raw and '/api/v1/' in raw:
            endpoints.append((req.get('method'), raw, item.get('name', '')))
    for sub in item.get('item', []):
        walk(sub)

for item in data.get('item', []):
    walk(item)

for method, raw, name in endpoints:
    print(method, raw, name)
print('count=', len(endpoints))
