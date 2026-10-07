import re
from typing import List

class DocumentEmbedder:
    """
    Simulates an embedding model by tokenizing and creating simple term frequencies.
    In a real system, this would use a model like sentence-transformers or Gemini Embeddings.
    """
    def embed_text(self, text: str) -> dict:
        text = text.lower()
        words = re.findall(r'\w+', text)
        freq = {}
        for w in words:
            freq[w] = freq.get(w, 0) + 1
        return freq

    def calculate_similarity(self, embed1: dict, embed2: dict) -> float:
        # Simple cosine similarity on term frequencies
        intersection = set(embed1.keys()) & set(embed2.keys())
        dot_product = sum(embed1[k] * embed2[k] for k in intersection)
        
        mag1 = sum(v**2 for v in embed1.values()) ** 0.5
        mag2 = sum(v**2 for v in embed2.values()) ** 0.5
        
        if mag1 == 0 or mag2 == 0:
            return 0.0
            
        return dot_product / (mag1 * mag2)
