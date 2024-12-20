import type { Address } from 'viem';

export interface Claim {
	staker: Address;
	amount: bigint;
	timestamp: number;
	transaction: Address;
}

export interface Earning {
	staker: Address;
	amount: bigint;
	timestamp: number;
	transaction: Address;
	pool: Address;
}

export interface Unstake {
	staker: Address;
	amount: bigint;
	timestamp: number;
	transaction: Address;
}

export interface ExtendedPoolInfo extends PoolInfo {
	realStaked: bigint;
	balance: bigint;
}

export interface PoolInfo {
	totalStaked: bigint;
	count: number;
	totalProfit: bigint;
	address: Address;
}

export type StakingType = 'conservative' | 'dynamic';

export interface StakedInfo {
	amount: number;
	blockTimestamp: number;
	pool: Address;
	unlock: number;
	staker: Address;
	reward: number;
	transactionHash: Address;
}

export interface TotalStatistics {
	timestamp: number;
	sum: number;
}

export interface TotalRevenueStatistics extends TotalStatistics {
	conservativeTotalRevenue: number;
	dynamicTotalRevenue: number;
}
export interface TotalStakersStatistics extends TotalStatistics {
	conservativeTotalStakers: number;
	dynamicTotalStakers: number;
}

export interface TotalStakingStatistics extends TotalStatistics {
	conservativeTotalStaking: number;
	dynamicTotalStaking: number;
}

export type Timeframe = 'hour' | 'day' | 'week' | 'cycle';
