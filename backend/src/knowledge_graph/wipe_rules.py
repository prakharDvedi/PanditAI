import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
USER = os.getenv("NEO4J_USER", "neo4j")
PASSWORD = os.getenv("NEO4J_PASSWORD", "pandit_secret_password")

def wipe_database():
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
    with driver.session() as session:
        print("🧹 Cleaning database...")
        # Delete all Rule nodes and their relationships
        session.run("MATCH (r:Rule) DETACH DELETE r")
        print("✅ Database wiped. Ready for custom rules.")
    driver.close()

if __name__ == "__main__":
    wipe_database()