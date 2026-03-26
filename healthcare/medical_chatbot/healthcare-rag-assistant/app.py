from flask import Flask, request, jsonify
from flask_cors import CORS
from src.helper import get_embedding_model
from src.prompt import system_prompt
from langchain_pinecone import PineconeVectorStore
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set. Check your .env file.")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY is not set. Check your .env file.")

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

INDEX_NAME = "medicomouno"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


def get_index_dimension(desc):
    return desc["dimension"] if isinstance(desc, dict) else desc.dimension


embeddings = get_embedding_model()
embedding_dim = len(embeddings.embed_query("dimension check"))

pc = Pinecone(api_key=PINECONE_API_KEY)
desc = pc.describe_index(name=INDEX_NAME)
index_dim = get_index_dimension(desc)

if index_dim != embedding_dim:
    raise ValueError(
        f"Pinecone index '{INDEX_NAME}' has dimension {index_dim}, "
        f"but embedding model gives dimension {embedding_dim}. "
        f"Run python store_index.py first."
    )

vector_store = PineconeVectorStore.from_existing_index(
    index_name=INDEX_NAME,
    embedding=embeddings
)

retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=GEMINI_API_KEY,
    temperature=0.3
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])


def format_docs(docs):
    if not docs:
        return "No relevant medical context found."
    return "\n\n".join(doc.page_content for doc in docs)


rag_chain = (
    {"context": retriever | format_docs, "input": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Healthcare assistant backend is running."}), 200


@app.route("/get", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        user_query = (data.get("user_query") or data.get("msg") or "").strip()

        if not user_query:
            return jsonify({"response": "Please provide a valid question."}), 400

        print("User Input:", user_query)
        assistant_response = rag_chain.invoke(user_query)
        print("Response:", assistant_response)

        return jsonify({"response": assistant_response}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"response": f"Server error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True, use_reloader=False)