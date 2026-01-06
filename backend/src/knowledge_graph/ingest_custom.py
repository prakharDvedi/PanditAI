import json
import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "pandit_secret_password")
JSON_FILE_PATH = "./data/custom_rules.json"

def ingest_expert_json():
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))

    if not os.path.exists(JSON_FILE_PATH):
        print(f"❌ Error: File not found at {JSON_FILE_PATH}")
        return

    with open(JSON_FILE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"🚀 Ingesting {len(data)} Expert Rules...")

    # CORRECTED QUERY (Removed # comments)
    query = """
    MERGE (r:Rule {id: $rule_id})
    SET r.text = $formatted_text,
        r.type = 'Placement',
        r.source = 'Expert Custom Rules',
        r.status = $status,
        r.strength = $strength_desc

    WITH r
    MATCH (p:Planet {name: $planet})
    MERGE (r)-[:MENTIONS_PLANET]->(p)

    WITH r
    MATCH (h:House {number: $house})
    MERGE (r)-[:APPLIES_TO_HOUSE]->(h)

    WITH r
    MATCH (s:Sign {name: $sign})
    MERGE (r)-[:IN_SIGN]->(s)
    """

    with driver.session() as session:
        count = 0
        for entry in data:
            try:
                # 1. PARSE THE ID (e.g., "Sun_H1_Aries")
                parts = entry["id"].split("_")
                
                planet_val = parts[0]   # "Sun"
                house_code = parts[1]   # "H1"
                sign_val = parts[2]     # "Aries"
                
                # Convert "H1" to integer 1
                house_val = int(house_code.replace("H", ""))

                # 2. EXTRACT PREDICTION DATA
                res = entry.get("results", {})
                general = res.get("general", "")
                positive = res.get("positive", "")
                negative = res.get("negative", "")
                
                # 3. FORMAT THE TEXT FOR AI
                formatted_text = (
                    f"OVERVIEW: {general}\n"
                    f"STRENGTHS: {positive}\n"
                    f"CHALLENGES: {negative}"
                )
                
                # 4. RUN QUERY
                session.run(query, 
                            rule_id=entry["id"],
                            planet=planet_val,
                            house=house_val,
                            sign=sign_val,
                            formatted_text=formatted_text,
                            status=entry.get("status", "Neutral"),
                            strength_desc=entry.get("strength", "Average")
                )

                count += 1
                if count % 50 == 0:
                    print(f"   ... {count} rules processed")
            
            except Exception as e:
                print(f"❌ Error processing rule ID {entry.get('id', 'UNKNOWN')}: {e}")

    print(f"✅ Success! {count} rules uploaded.")
    driver.close()

if __name__ == "__main__":
    ingest_expert_json()