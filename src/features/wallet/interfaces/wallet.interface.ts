import { Wallet } from "generated/prisma/client";

export const WALLET_REPOSITORY = Symbol('WALLET_REPOSITORY');

export interface IWalletRepository {
    createWallet(payload: any, merchantId: string): Promise<Wallet>;
    findWalletById(id: string): Promise<Wallet | null>;
    getAllWallets(): Promise<Wallet[]>;
    getWalletByMerchantId(merchantId: string): Promise<Wallet[]>;
    updateWallet(id: string, payload: any): Promise<Wallet>;
    deleteWallet(id: string): Promise<Wallet>;
    deleteByMerchantId(merchantId: string): Promise<{ count: number }>;
}