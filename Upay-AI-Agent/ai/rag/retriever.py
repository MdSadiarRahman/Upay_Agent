import os
from .embeddings import DocumentEmbedder

class RAGRetriever:
    def __init__(self, kb_path: str = None):
        if kb_path is None:
            # Default to the knowledge_base directory next to this file
            kb_path = os.path.join(os.path.dirname(__file__), "knowledge_base")
        
        self.kb_path = kb_path
        self.embedder = DocumentEmbedder()
        self.documents = []
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        """Loads and chunks documents from the knowledge base."""
        if not os.path.exists(self.kb_path):
            return
            
        for filename in os.listdir(self.kb_path):
            if filename.endswith(".txt") or filename.endswith(".md"):
                filepath = os.path.join(self.kb_path, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Simple chunking by paragraph/section
                    chunks = [c.strip() for c in content.split('\n\n') if c.strip()]
                    for chunk in chunks:
                        self.documents.append({
                            "text": chunk,
                            "source": filename,
                            "embedding": self.embedder.embed_text(chunk)
                        })

    def retrieve(self, query: str, top_k: int = 2) -> list:
        """Retrieves the most relevant knowledge base chunks for a query."""
        if not self.documents:
            return []
            
        query_embed = self.embedder.embed_text(query)
        
        results = []
        for doc in self.documents:
            score = self.embedder.calculate_similarity(query_embed, doc["embedding"])
            if score > 0.1: # Threshold
                results.append({
                    "text": doc["text"],
                    "source": doc["source"],
                    "score": score
                })
                
        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
