import csv, json, re

with open(r'C:\Users\JAI HARISH\ML project\app\data\games.json', encoding='utf-8') as f:
    games = json.load(f)
top_ids = {g['id'] for g in games[:30]}

with open(r'C:\Users\JAI HARISH\ML project\games.csv', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get('AppID','') in top_ids:
            about = row.get('About the game', '') or ''
            print(f"ID={row['AppID']} Name={row.get('Name','')[:25]}")
            print(f"  About({len(about)}): {about[:100]}")
            print(f"  Positive={row.get('Positive','')}")
