# src/knowledge_graph/query.py
import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

class PanditGraphQuery:
    def __init__(self):
        uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        user = os.getenv("NEO4J_USER", "neo4j")
        password = os.getenv("NEO4J_PASSWORD", "pandit_secret_password")
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def get_comprehensive_rules(self, chart_data, house_structure):
        all_rules = []
        ZODIAC = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

        with self.driver.session() as session:
            for p_name, p_data in chart_data.items():
                if p_name == "Ascendant": continue
                
                h_num = p_data.get("house_number")
                s_id = p_data.get("sign_id")
                
                if not h_num or s_id is None: continue
                s_name = ZODIAC[s_id]

                # Match Planet + House + Sign
                result = session.run("""
                    MATCH (p:Planet {name: $planet})
                    MATCH (h:House {number: $house})
                    MATCH (s:Sign {name: $sign})
                    MATCH (r:Rule)-[:MENTIONS_PLANET]->(p)
                    MATCH (r)-[:APPLIES_TO_HOUSE]->(h)
                    MATCH (r)-[:IN_SIGN]->(s)
                    RETURN r.text as text
                """, planet=p_name, house=h_num, sign=s_name)
                
                for record in result:
                    all_rules.append({
                        "focus": f"{p_name} in {s_name} (House {h_num})",
                        "type": "Expert Prediction",
                        "rule": record["text"]
                    })
        return all_rules

    def semantic_search(self, user_question, top_k=3):
        # Local import to avoid overhead if not used
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('all-MiniLM-L6-v2')
        question_vector = model.encode(user_question).tolist()

        query = """
        CALL db.index.vector.queryNodes('rule_embeddings', $k, $vec)
        YIELD node, score
        RETURN node.text as rule_text, node.source as source, score
        """
        with self.driver.session() as session:
            result = session.run(query, k=top_k, vec=question_vector)
            return [record.data() for record in result]