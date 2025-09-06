export type Chain = "Ethereum" | "Polygon" | "Solana";

export interface NFTItem {
  id: string;
  title: string;
  image: string;
  chain: Chain;
  tokenId?: string;
  contract?: string;
  owner?: string;
  description?: string;
  collection?: string;
}

export interface NFTEvent {
  id: string;
  type: "Minted" | "Transferred" | "Listed" | "Burned";
  date: string;
  details: string;
}

export const sampleNFTs: NFTItem[] = [
  {
    id: "1",
    title: "Aurora Wave",
    image: "https://images.unsplash.com/photo-1526312426976-593c2d0c1a06?q=80&w=1200&auto=format&fit=crop",
    chain: "Ethereum",
    tokenId: "#1024",
    contract: "0x1234...ABCD",
    owner: "0xDEAD...BEEF",
    description: "AI-generated abstract gradient with aurora sweep.",
    collection: "Genesis",
  },
  {
    id: "2",
    title: "Teal Drift",
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop",
    chain: "Polygon",
    tokenId: "#2048",
    contract: "0x4321...CDEF",
    owner: "0xFEED...FACE",
    description: "Minimal teal-to-blue composition.",
    collection: "Genesis",
  },
  {
    id: "3",
    title: "Noir Leaf",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1200&auto=format&fit=crop",
    chain: "Solana",
    tokenId: "#4096",
    contract: "So1...ana",
    owner: "So1...ana",
    description: "Soft monochrome botanical.",
    collection: "Mono",
  },
];

export const sampleHistory: NFTEvent[] = [
  { id: "e1", type: "Minted", date: "2025-01-01", details: "Minted by 0xDEAD...BEEF" },
  { id: "e2", type: "Listed", date: "2025-01-03", details: "Listed for 0.25 ETH" },
  { id: "e3", type: "Transferred", date: "2025-01-10", details: "Transferred to 0xFEED...FACE" },
];
