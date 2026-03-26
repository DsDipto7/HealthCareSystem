from src.helper import load_medical_documents, split_documents_into_chunks, get_embedding_model
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv
import os
import time

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set in .env")

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY

INDEX_NAME = "medicomouno"
CLOUD = "aws"
REGION = "us-east-1"


def get_index_names(pc):
    indexes = pc.list_indexes()
    return [idx["name"] if isinstance(idx, dict) else idx.name for idx in indexes]


def get_index_dimension(desc):
    return desc["dimension"] if isinstance(desc, dict) else desc.dimension


def get_index_ready(desc):
    status = desc["status"] if isinstance(desc, dict) else desc.status
    if isinstance(status, dict):
        return status.get("ready", False)
    return getattr(status, "ready", False)


print("Loading medical source PDFs from Data/ directory...")
documents = load_medical_documents("Data/")
print(f"Loaded {len(documents)} pages from PDF files.")

print("Splitting documents into chunks...")
text_chunks = split_documents_into_chunks(documents)
print(f"Split into {len(text_chunks)} text chunks.")

print("Loading HuggingFace embeddings model...")
embeddings = get_embedding_model()
embedding_dim = len(embeddings.embed_query("dimension check"))
print(f"Embeddings model loaded successfully. Dimension = {embedding_dim}")

pc = Pinecone(api_key=PINECONE_API_KEY)

existing_indexes = get_index_names(pc)

if INDEX_NAME in existing_indexes:
    desc = pc.describe_index(name=INDEX_NAME)
    existing_dim = get_index_dimension(desc)
    print(f"Existing Pinecone index '{INDEX_NAME}' dimension = {existing_dim}")

    if existing_dim != embedding_dim:
        print(f"Wrong dimension found. Deleting old index '{INDEX_NAME}'...")
        pc.delete_index(name=INDEX_NAME)

        while INDEX_NAME in get_index_names(pc):
            print("Waiting for old index deletion...")
            time.sleep(2)

        existing_indexes = get_index_names(pc)

if INDEX_NAME not in existing_indexes:
    print(f"Creating new Pinecone index '{INDEX_NAME}' with dimension {embedding_dim}...")
    pc.create_index(
        name=INDEX_NAME,
        dimension=embedding_dim,
        metric="cosine",
        spec=ServerlessSpec(
            cloud=CLOUD,
            region=REGION
        )
    )

while True:
    desc = pc.describe_index(name=INDEX_NAME)
    if get_index_ready(desc):
        break
    print("Waiting for index to become ready...")
    time.sleep(2)

print(f"Uploading {len(text_chunks)} chunks to Pinecone index '{INDEX_NAME}'...")
PineconeVectorStore.from_documents(
    documents=text_chunks,
    embedding=embeddings,
    index_name=INDEX_NAME
)

print("All embeddings uploaded successfully!")