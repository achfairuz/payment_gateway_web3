import { Wallet } from 'generated/prisma/client';

export const WALLET_REPOSITORY = Symbol('WALLET_REPOSITORY');

export interface CreateWalletPayload {
  address: string;
  network: string;
  isDefault?: boolean;
}

export interface UpdateWalletPayload {
  address: string;
  network: string;
}

export interface IWalletRepository {
  createWallet(payload: CreateWalletPayload, merchantId: string): Promise<Wallet>;
  findWalletById(id: string): Promise<Wallet | null>;
  getAllWallets(): Promise<Wallet[]>;
  getWalletByMerchantId(merchantId: string): Promise<Wallet[]>;
  updateWallet(id: string, merchantId: string, payload: UpdateWalletPayload): Promise<Wallet>;
  deleteWallet(id: string, merchantId: string): Promise<Wallet>;
  deleteByMerchantId(merchantId: string): Promise<{ count: number }>;
  setDefaultWallet(id: string, merchantId: string): Promise<Wallet>;
}
