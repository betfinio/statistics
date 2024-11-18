import {
	AFFILIATE_FUND_ADDRESS,
	AFFILIATE_INITIAL_SUPPLY,
	BONUS_POOL_ADDRESS,
	CONSERVATIVE_STAKING_ADDRESS,
	DYNAMIC_STAKING_ADDRESS,
	LIQUIDITY_POOL_ADDRESS,
	PARTNERS_POOL_ADDRESS,
	PASS_ADDRESS,
	TEAM_POOL_ADDRESS,
	TOKEN_ADDRESS,
	TOKEN_INITIAL_SUPPLY,
	USDT_TOKEN_ADDRESS,
} from '@/src/globals.ts';
import type { TotalRevenueStatistics, TotalStakersStatistics, TotalStakingStatistics } from '@/src/lib/types.ts';
import { ConservativeStakingContract, DynamicStakingContract, PassContract, TokenContract, valueToNumber } from '@betfinio/abi';
import { multicall, readContract } from '@wagmi/core';
import type { Address } from 'viem';
import type { Config } from 'wagmi';

export const defaultTotalRevenueStatistics: TotalRevenueStatistics = {
	conservativeTotalRevenue: 0,
	dynamicTotalRevenue: 0,
	timestamp: 0,
	sum: 0,
};

export const defaultTotalStakersStatistics: TotalStakersStatistics = {
	conservativeTotalStakers: 0,
	dynamicTotalStakers: 0,
	timestamp: 0,
	sum: 0,
};

export const defaultTotalStakingStatistics: TotalStakingStatistics = {
	conservativeTotalStaking: 0,
	dynamicTotalStaking: 0,
	timestamp: 0,
	sum: 0,
};

export const fetchStakedStatisticsTotalCurrent = async (config: Config): Promise<TotalStakingStatistics> => {
	const result = await multicall(config, {
		contracts: [
			{
				abi: DynamicStakingContract.abi,
				address: DYNAMIC_STAKING_ADDRESS as Address,
				functionName: 'totalStaked',
			},
			{
				abi: ConservativeStakingContract.abi,
				address: CONSERVATIVE_STAKING_ADDRESS as Address,
				functionName: 'totalStaked',
			},
		],
	});

	if (!result) {
		return defaultTotalStakingStatistics;
	}

	return result.reduce((acc, item, index) => {
		if (index === 1) {
			acc.conservativeTotalStaking = valueToNumber(item.result as bigint);
			acc.sum = (acc.sum ?? 0) + acc.conservativeTotalStaking;
		}
		if (index === 0) {
			acc.dynamicTotalStaking = valueToNumber(item.result as bigint);
			acc.sum = (acc.sum ?? 0) + acc.dynamicTotalStaking;
		}
		acc.timestamp = new Date().getTime() / 1000;

		return acc;
	}, defaultTotalStakingStatistics);
};
export const fetchStakerStatisticsTotalCurrent = async (config: Config): Promise<TotalStakersStatistics> => {
	const result = await multicall(config, {
		contracts: [
			{
				abi: DynamicStakingContract.abi,
				address: DYNAMIC_STAKING_ADDRESS as Address,
				functionName: 'totalStakers',
			},
			{
				abi: ConservativeStakingContract.abi,
				address: CONSERVATIVE_STAKING_ADDRESS as Address,
				functionName: 'totalStakers',
			},
		],
	});

	if (!result) {
		return defaultTotalStakersStatistics;
	}

	return result.reduce((acc, item, index) => {
		if (index === 1) {
			acc.conservativeTotalStakers = Number(item.result);
			acc.sum = (acc.sum ?? 0) + acc.conservativeTotalStakers;
		}
		if (index === 0) {
			acc.dynamicTotalStakers = Number(item.result);
			acc.sum = (acc.sum ?? 0) + acc.dynamicTotalStakers;
		}
		acc.timestamp = Math.floor(new Date().getTime() / 1000);

		return acc;
	}, defaultTotalStakersStatistics);
};
export const fetchRevenueStatisticsTotalCurrent = async (config: Config): Promise<TotalRevenueStatistics> => {
	const conservativeResults = await multicall(config, {
		contracts: [
			{
				abi: ConservativeStakingContract.abi,
				address: CONSERVATIVE_STAKING_ADDRESS as Address,
				functionName: 'totalProfit',
			},
			{
				abi: TokenContract.abi,
				address: TOKEN_ADDRESS,
				functionName: 'balanceOf',
				args: [CONSERVATIVE_STAKING_ADDRESS],
			},
		],
	});
	const dynamicResults = await multicall(config, {
		contracts: [
			{
				abi: DynamicStakingContract.abi,
				address: DYNAMIC_STAKING_ADDRESS as Address,
				functionName: 'totalProfit',
			},
			{
				abi: TokenContract.abi,
				address: TOKEN_ADDRESS,
				functionName: 'balanceOf',
				args: [DYNAMIC_STAKING_ADDRESS],
			},
			{
				abi: DynamicStakingContract.abi,
				address: DYNAMIC_STAKING_ADDRESS,
				functionName: 'realStaked',
			},
		],
	});

	const conservativeTotalRevenue = valueToNumber(conservativeResults[0].result as bigint) - valueToNumber(conservativeResults[1].result as bigint);
	const dynamicTotalRevenue =
		valueToNumber(dynamicResults[0].result as bigint) + valueToNumber(dynamicResults[1].result as bigint) - valueToNumber(dynamicResults[2].result as bigint);
	if (!conservativeTotalRevenue || !dynamicTotalRevenue) return defaultTotalRevenueStatistics;
	return {
		conservativeTotalRevenue: conservativeTotalRevenue,
		dynamicTotalRevenue,
		timestamp: Math.floor(new Date().getTime() / 1000),
		sum: conservativeTotalRevenue + dynamicTotalRevenue,
	};
};
export const fetchTotalMembers = async (config: Config): Promise<number> => {
	const result = await readContract(config, {
		abi: PassContract.abi,
		address: PASS_ADDRESS as Address,
		functionName: 'getMembersCount',
	});

	if (!result) {
		return 0;
	}
	return Number(result);
};
export const fetchTotalAffiliatePaid = async (config: Config): Promise<bigint> => {
	const result = (await readContract(config, {
		abi: TokenContract.abi,
		address: TOKEN_ADDRESS as Address,
		functionName: 'balanceOf',
		args: [AFFILIATE_FUND_ADDRESS as Address],
	})) as bigint;

	if (!result) {
		return 0n;
	}
	return AFFILIATE_INITIAL_SUPPLY - result;
};

export const fetchLiquidityInPool = async (config: Config) => {
	const betResult = (await readContract(config, {
		abi: TokenContract.abi,
		address: TOKEN_ADDRESS as Address,
		functionName: 'balanceOf',
		args: [LIQUIDITY_POOL_ADDRESS as Address],
	})) as bigint;
	const usdtResult = (await readContract(config, {
		abi: TokenContract.abi,
		address: USDT_TOKEN_ADDRESS as Address,
		functionName: 'balanceOf',
		args: [LIQUIDITY_POOL_ADDRESS as Address],
	})) as bigint;
	if (!betResult || !betResult) {
		return { betResult: 0n, usdtResult: 0n };
	}

	return { betResult, usdtResult };
};

export const fetchCurrentDistribution = async (config: Config): Promise<number[]> => {
	const data = await multicall(config, {
		contracts: [
			{
				abi: TokenContract.abi,
				address: TOKEN_ADDRESS as Address,
				functionName: 'balanceOf',
				args: [BONUS_POOL_ADDRESS as Address],
			},
			{
				abi: TokenContract.abi,
				address: TOKEN_ADDRESS as Address,
				functionName: 'balanceOf',
				args: [PARTNERS_POOL_ADDRESS as Address],
			},
			{
				abi: TokenContract.abi,
				address: TOKEN_ADDRESS as Address,
				functionName: 'balanceOf',
				args: [TEAM_POOL_ADDRESS as Address],
			},
			{
				abi: TokenContract.abi,
				address: TOKEN_ADDRESS as Address,
				functionName: 'balanceOf',
				args: [AFFILIATE_FUND_ADDRESS as Address],
			},
		],
	});

	const [bonusPool, partnersPool, teamPool, affiliatePool]: bigint[] = data.map((item) => item.result as bigint);

	const stakedData = await fetchStakedStatisticsTotalCurrent(config);
	const liquidityData = await fetchLiquidityInPool(config);

	const staked = stakedData.sum || 0;
	const lockedLiquidity = liquidityData.betResult || 0n;

	const formattedData = [bonusPool, BigInt(staked) * 10n ** 18n, lockedLiquidity, teamPool, affiliatePool, partnersPool];
	const formattedDataSum = formattedData.reduce((acc, item) => acc + item, 0n);

	const freeBetTokens = TOKEN_INITIAL_SUPPLY - formattedDataSum;
	formattedData.splice(1, 0, freeBetTokens);

	return formattedData.map((value) => valueToNumber(value));
};
