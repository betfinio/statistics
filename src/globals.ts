import type { Address } from 'viem';

export const TOKEN_ADDRESS: Address = import.meta.env.PUBLIC_TOKEN_ADDRESS;
export const LIQUIDITY_POOL_ADDRESS: Address = import.meta.env.PUBLIC_LIQUIDITY_POOL_ADDRESS;
export const USDT_TOKEN_ADDRESS: Address = import.meta.env.PUBLIC_USDT_TOKEN_ADDRESS;
export const BONUS_POOL_ADDRESS: Address = import.meta.env.PUBLIC_BONUS_POOL_ADDRESS;
export const PARTNERS_POOL_ADDRESS: Address = import.meta.env.PUBLIC_PARTNERS_POOL_ADDRESS;
export const TEAM_POOL_ADDRESS: Address = import.meta.env.PUBLIC_TEAM_POOL_ADDRESS;
export const AFFILIATE_FUND_ADDRESS: Address = import.meta.env.PUBLIC_AFFILIATE_FUND_ADDRESS;
export const CONSERVATIVE_STAKING_ADDRESS: Address = import.meta.env.PUBLIC_CONSERVATIVE_STAKING_ADDRESS;
export const DYNAMIC_STAKING_ADDRESS: Address = import.meta.env.PUBLIC_DYNAMIC_STAKING_ADDRESS;
export const PASS_ADDRESS: Address = import.meta.env.PUBLIC_PASS_ADDRESS;
export const AFFILIATE_INITIAL_SUPPLY: bigint = 381111111111n * 10n ** 18n;
export const TOKEN_INITIAL_SUPPLY: bigint = 777777777n * 10n ** 18n;
