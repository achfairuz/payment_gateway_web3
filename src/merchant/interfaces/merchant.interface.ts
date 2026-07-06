export interface Merchant {
    id: string;
    user: {
        id: string;
        email: string;
    }
    name: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateMerchantResponse {
    name: string;
    userId: string;
}