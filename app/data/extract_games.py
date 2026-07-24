import csv, json, os, re

csv_path = r"C:\Users\JAI HARISH\ML project\games.csv"
out_path  = r"C:\Users\JAI HARISH\ML project\app\data\games.json"

# Curated real descriptions for well-known Steam games (by AppID)
CURATED = {
    "730":    "Counter-Strike 2 is the largest technical leap in CS history, built on the Source 2 engine. Offering a state-of-the-art competitive shooter with updated maps, improved smoke grenades, and a fully revamped weapon system.",
    "570":    "Dota 2 is a multiplayer online battle arena game where two teams of five players compete to destroy the opponent's Ancient structure, choosing from over 120 unique heroes.",
    "578080": "PUBG: BATTLEGROUNDS drops 100 players onto an island where they fight to the death in a shrinking play zone, scavenging weapons and vehicles to outlast all rivals.",
    "252490": "Rust is an open-world survival game where you start with only a rock and must gather resources, craft tools, build shelters, and fight other players and nature to survive.",
    "1086940":"Baldur's Gate 3 is a next-generation RPG set in the Forgotten Realms. Gather your party, build powerful bonds, and overcome the corruption spreading through the Sword Coast.",
    "271590": "Grand Theft Auto V offers an expansive open world spanning a fictional version of Los Angeles where three criminals plan and execute heists while under pressure from a government agency.",
    "1172470":"Apex Legends is a free-to-play battle royale game set in the Titanfall universe where legendary characters with powerful abilities team up to battle for glory and survival.",
    "440":    "Team Fortress 2 is a team-based action game featuring nine distinct character classes with unique weapons and abilities in multi-team objective-based combat across countless maps.",
    "553850": "HELLDIVERS 2 puts you in the role of a Super Earth soldier fighting to spread Managed Democracy across the galaxy, one alien planet at a time — cooperative chaos at its finest.",
    "1938090":"Call of Duty is back in its most-polished form yet, delivering the tight gunplay and heart-pounding multiplayer that defined a generation of first-person shooters.",
    "381210": "Dead by Daylight is a multiplayer horror experience where one killer hunts four survivors in an eerie procedural environment. It's a deadly game of cat and mouse.",
    "413150": "Stardew Valley is a charming farming RPG where you escape city life to restore a run-down farm. Plant crops, befriend villagers, explore caves, and build your dream homestead.",
    "359550": "Tom Clancy's Rainbow Six Siege is a tactical shooter where operators with unique gadgets face off in destructible environments in high-stakes 5v5 rounds.",
    "2767030":"Marvel Rivals is a hero shooter featuring Marvel characters battling across iconic locations. Combine unique powers and team-up abilities to dominate the battlefield.",
    "3241660":"R.E.P.O. is a co-operative horror extraction game. You and your crew of robots are tasked with retrieving valuable objects from terrifying locations for a mysterious employer.",
    "236390": "War Thunder is the most comprehensive free-to-play, cross-platform military game featuring aircraft, helicopters, tanks and ships from the early 20th century to today.",
    "438100": "VRChat is an online virtual reality social platform that lets you explore a world built by its community — attend events, create avatars, and meet people from across the globe.",
    "230410": "Warframe is a free-to-play action RPG where you play as the Tenno — ancient warriors wielding powerful exoskeletons called Warframes — fighting across a sprawling solar system.",
    "322330": "Don't Starve Together is a survival game where you and your friends explore a harsh wilderness, craft tools, fight monsters, and try not to go insane in a dark and whimsical world.",
    "394360": "Hearts of Iron IV lets you lead any nation through the darkest days of the Second World War. Guide your country to glory in the most sophisticated grand strategy game to date.",
    "431960": "Wallpaper Engine enables you to use animated and interactive wallpapers on your desktop. Choose from thousands of animated wallpapers or create your own in the editor.",
    "221100": "DayZ is a hardcore open-world survival game in a post-Soviet country called Chernarus. Loot abandoned towns, survive brutal winters, and beware of infected and hostile players.",
    "1203220":"NARAKA: BLADEPOINT is a 60-player melee-focused battle royale where you use martial arts, powerful weapons, and unique hero abilities to be the last warrior standing.",
    "1671210":"DELTARUNE is the chapter-based follow-up to Undertale. Kris and Susie fall into the Dark World and must fight — or spare — its strange inhabitants in an unforgettable RPG.",
    "1366800":"Crosshair X is an advanced crosshair overlay tool for competitive gamers, offering full customisation for any first-person shooter that doesn't include built-in crosshair settings.",
    "2622380":"ELDEN RING NIGHTREIGN is a standalone co-op survival experience set in the world of Elden Ring. Battle shifting environments and formidable foes across three-day cycles.",
    "3419430":"Bongo Cat is a relaxing desktop companion featuring an adorable cat that plays bongo drums in sync with your keyboard inputs — a viral hit turned into a full Steam release.",
    "2669320":"EA SPORTS FC 25 is the next evolution in football gaming, featuring HyperMotionV technology, new Rush mode, and enhanced FC IQ intelligence for the most realistic football experience.",
    "3240220":"Grand Theft Auto V Enhanced Edition delivers the beloved open-world crime epic with improved graphics and performance on the latest hardware, now available on Steam.",
    "2252570":"Football Manager 2024 puts you in the hot seat as a football manager, giving you complete control over tactics, transfers, team talks, and every other aspect of running a club.",
}

GENRE_DESC = {
    "Action":    "An action-packed experience featuring fast-paced combat, explosive set-pieces, and relentless gameplay that will keep you on the edge of your seat.",
    "Adventure": "Embark on an epic adventure filled with exploration, rich storytelling, and discovery in beautifully crafted worlds.",
    "RPG":       "A deep role-playing experience where your choices shape the story, your character grows in power, and every decision has lasting consequences.",
    "Strategy":  "Plan, build, and outmanoeuvre your opponents in this deep strategic experience requiring careful resource management and tactical thinking.",
    "Simulation":"A highly detailed simulation that replicates real-world systems with impressive depth and authenticity.",
    "Racing":    "Hit the gas and race against rivals in high-speed competition across diverse tracks, showcasing precision driving and adrenaline-fuelled action.",
    "Sports":    "Compete in authentic sports action with realistic mechanics, team management, and competitive multiplayer modes.",
    "Horror":    "A terrifying experience that plunges you into darkness and dread — survive the horrors that lurk around every corner.",
    "Puzzle":    "Challenge your mind with intricate puzzles that demand creative thinking, spatial reasoning, and clever problem-solving.",
    "Fighting":  "Master devastating move sets and defeat opponents in intense one-on-one or team-based fighting combat.",
    "Casual":    "Easy to pick up and endlessly enjoyable — perfect for a relaxing gaming session whenever you have a spare moment.",
    "Indie":     "A unique indie experience crafted with passion and creativity, offering fresh ideas and an unforgettable personal touch.",
    "Shooter":   "Lock and load in this adrenaline-fuelled shooter featuring intense gunplay, tactical depth, and non-stop action across varied environments.",
    "Survival":  "Gather resources, build shelter, and fight to stay alive in an unforgiving open world that tests your every decision.",
    "Massively Multiplayer": "Join thousands of players online in a persistent living world filled with quests, guilds, player economies, and endless adventure.",
    "Free to Play": "Jump in for free and enjoy a fully-featured gaming experience with optional cosmetic purchases and regular content updates.",
}

games = []
skipped = 0

with open(csv_path, encoding="utf-8", errors="replace") as f:
    reader = csv.DictReader(f)

    for row in reader:
        try:
            app_id = (row.get("AppID") or "").strip()
            if not app_id or not app_id.isdigit():
                skipped += 1; continue

            name = (row.get("Name") or "").strip()
            if not name:
                skipped += 1; continue

            pos      = int(row.get("Positive", 0) or 0)
            neg      = int(row.get("Negative", 0) or 0)
            peak_ccu = int(row.get("Peak CCU", 0) or 0)

            if pos == 0 and peak_ccu == 0:
                skipped += 1; continue

            # Image
            img = (row.get("Header image") or "").strip()
            if not img or "akamai" not in img:
                img = (row.get("Website") or "").strip()
            if not img or "akamai" not in img:
                img = f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{app_id}/header.jpg"

            # Score
            total = pos + neg
            score = round((pos / total) * 10, 1) if total > 100 else 0.0

            # Genres & Tags
            genres_raw = (row.get("Genres") or "").strip()
            tags_raw   = (row.get("Tags") or "").strip()
            genres = [g.strip() for g in genres_raw.split(",") if g.strip()][:3]
            tags   = [t.strip() for t in tags_raw.split(",") if t.strip()][:10]

            # Description: curated > CSV cleaned > genre fallback
            if app_id in CURATED:
                about = CURATED[app_id]
            else:
                about_raw = (row.get("About the game") or "").strip()
                about_clean = re.sub(r'<[^>]+>', '', about_raw)
                about_clean = re.sub(r'\s+', ' ', about_clean).strip()
                if len(about_clean) > 300:
                    about_clean = about_clean[:297] + "…"
                if len(about_clean) < 30:
                    primary = genres[0] if genres else "Casual"
                    about   = GENRE_DESC.get(primary, f"An exciting gaming experience in {name}.")
                else:
                    about = about_clean

            # Year
            rd = (row.get("Release date") or "").strip()
            year = ""
            if rd:
                m = re.search(r'\b(19|20)\d{2}\b', rd)
                year = m.group(0) if m else ""

            # Metacritic
            mc = 0
            try:
                mc_raw = (row.get("Metacritic score") or "").strip()
                if mc_raw and mc_raw not in ("0","False",""):
                    mc = int(mc_raw)
            except Exception: pass

            win   = (row.get("Windows") or "").strip()
            mac_f = (row.get("Mac")     or "").strip()
            linux = (row.get("Linux")   or "").strip()

            games.append({
                "id":        app_id,
                "name":      name,
                "year":      year,
                "image":     img,
                "genres":    genres,
                "tags":      tags,
                "score":     score,
                "positive":  pos,
                "negative":  neg,
                "peak_ccu":  peak_ccu,
                "developer": (row.get("Developers") or "").strip()[:80],
                "publisher": (row.get("Publishers") or "").strip()[:80],
                "metacritic": mc,
                "windows":   win   in ("True","true","1"),
                "mac":       mac_f in ("True","true","1"),
                "linux":     linux in ("True","true","1"),
                "about":     about,
            })
        except Exception:
            skipped += 1; continue

print(f"Parsed {len(games)}, skipped {skipped}")
games.sort(key=lambda g: g["positive"]*2 + g["peak_ccu"], reverse=True)
games = games[:300]

os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(games, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(games)} games")
for g in games[:5]:
    print(f"  {g['name']}: {g['about'][:90]}")
