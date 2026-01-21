
import { CosmosClient } from "@azure/cosmos";
import { BlobServiceClient } from "@azure/storage-blob";

// NOTE: In a production app, use Azure Functions or a backend API to keep keys secure.
// For this prototype, we are using client-side SDKs.

const DATA_CONNECTION_STRING = import.meta.env.VITE_AZURE_COSMOS_CONNECTION_STRING as string;
const BLOB_CONNECTION_STRING = import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING as string;

const DATABASE_ID = "CatalogoDB";
const CONTAINER_PRODUCTS = "Products";
const CONTAINER_IMAGES = "product-images";
const CONTAINER_DOCS = "product-docs";

export const azureService = {

    async uploadFile(file: File, type: 'image' | 'document'): Promise<string> {
        if (!BLOB_CONNECTION_STRING) {
            console.warn("Azure Storage Connection String not found in .env.local");
            // Return a mock URL for local testing without keys
            return URL.createObjectURL(file);
        }

        try {
            const blobServiceClient = BlobServiceClient.fromConnectionString(BLOB_CONNECTION_STRING);
            const containerName = type === 'image' ? CONTAINER_IMAGES : CONTAINER_DOCS;
            const containerClient = blobServiceClient.getContainerClient(containerName);

            // Ensure container exists (public access for images for easier viewing)
            await containerClient.createIfNotExists({
                access: type === 'image' ? 'blob' : undefined
            });

            const blobName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(file);
            return blockBlobClient.url;
        } catch (error) {
            console.error("Error uploading to Azure Blob:", error);
            throw new Error("Falha no upload para o Azure Blob Storage");
        }
    },

    async saveProduct(productData: any) {
        console.log("Saving Product to Azure...", productData);

        if (!DATA_CONNECTION_STRING) {
            console.warn("Azure Cosmos Connection String not found in .env.local");
            // Simulate network delay
            await new Promise(r => setTimeout(r, 1000));
            return { id: "mock-id-" + Date.now(), ...productData };
        }

        try {
            const client = new CosmosClient(DATA_CONNECTION_STRING);
            const database = client.database(DATABASE_ID);
            const container = database.container(CONTAINER_PRODUCTS);

            // Ensure DB and Container exist
            // Note: Creating DBs/Containers requires higher permissions than just write
            await client.databases.createIfNotExists({ id: DATABASE_ID });
            await database.containers.createIfNotExists({ id: CONTAINER_PRODUCTS });

            const doc = {
                id: productData.sku || `auto-${Date.now()}`,
                ...productData,
                createdAt: new Date().toISOString(),
                partitionKey: "PRODUCT" // Ensuring we have a consistent partition key
            };

            const { resource: createdItem } = await container.items.create(doc);
            console.log("Saved to Azure Cosmos:", createdItem);
            return createdItem;
        } catch (error) {
            console.error("Error saving to Azure Cosmos:", error);
            throw new Error("Falha no salvamento no Azure Cosmos DB");
        }
    }
};
