import {
	GetStakingStatsCycleDocument,
	type GetStakingStatsCycleQuery,
	GetStakingStatsDocument,
	type GetStakingStatsQuery,
	type GetTotalConservativeDistributionsQuery,
	GetTotalPlayersDocument,
	type GetTotalPlayersQuery,
	GetTradingVolumeDocument,
	type GetTradingVolumeQuery,
	execute,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import { LIQUIDITY_POOL_ADDRESS } from '@/src/globals.ts';
import { valueToNumber } from '@betfinio/abi';
import type { ExecutionResult } from 'graphql/execution';
import type { StakingType, Timeframe } from '../../types';

export const mapStakingStatistics = (item: GetStakingStatsCycleQuery['totalStakingStatistics_collection'][number]) => {
	return {
		conservativeTotalStaked: valueToNumber(item.conservativeTotalStaking),
		dynamicTotalStaked: valueToNumber(item.dynamicTotalStaking),
		timestamp: new Date(+item.timestamp * 1000).getTime() / 1000,
		conservativeTotalStakers: +item.conservativeTotalStakers,
		dynamicTotalStakers: +item.dynamicTotalStakers,
		dynamicTotalRevenue: valueToNumber(item.dynamicTotalRevenues),
		conservativeTotalRevenue: valueToNumber(item.conservativeTotalRevenues),
		dynamicTotalRevenuePercentage: (valueToNumber(item.dynamicTotalRevenues) / valueToNumber(item.dynamicTotalStaking)) * 100,
		conservativeTotalRevenuePercentage: (valueToNumber(item.conservativeTotalRevenues) / valueToNumber(item.conservativeTotalStaking)) * 100,
	};
};

export const fetchStatisticsTotalStaking = async ({
	timeSeriesType,
	stakingType,
	first = 20,
	startFrom,
}: {
	timeSeriesType: Timeframe;
	stakingType?: StakingType;
	first?: number;
	startFrom?: number;
}) => {
	if (timeSeriesType === 'cycle') {
		if (stakingType === 'conservative') {
			const timeSeries = 'hour';
			const data: ExecutionResult<GetStakingStatsCycleQuery> = await execute(GetStakingStatsCycleDocument, {
				timeSeriesType: timeSeries,
				first: 168,
				fromTime: `${(startFrom ?? 0) / 1000}`,
			});
			if (!data.data) {
				return [];
			}

			const formattedData = data.data.totalStakingStatistics_collection.reverse().map(mapStakingStatistics);

			if (formattedData.length > 42) {
				return formattedData.filter((_, index) => index % 4 === 0 || index === 0);
			}

			return formattedData;
		}
		if (stakingType === 'dynamic') {
			const timeSeries = 'day';
			const data: ExecutionResult<GetStakingStatsQuery> = await execute(GetStakingStatsCycleDocument, {
				timeSeriesType: timeSeries,
				first: 30,
				fromTime: `${(startFrom ?? 0) / 1000}`,
			});
			if (!data.data) {
				return [];
			}
			return data.data.totalStakingStatistics_collection.reverse().map(mapStakingStatistics);
		}
	}

	logger.start('[statistics]', 'fetching stakes statistics');
	const data: ExecutionResult<GetStakingStatsQuery> = await execute(GetStakingStatsDocument, { timeSeriesType, first });

	const formattedData = data.data?.totalStakingStatistics_collection.reverse().map(mapStakingStatistics);
	logger.success('[statistics]', 'fetching stakes statistics', formattedData);

	return formattedData;
};

export const fetchTotalPlayers = async () => {
	logger.start('[statistics]', 'fetching total players');
	const data: ExecutionResult<GetTotalPlayersQuery> = await execute(GetTotalPlayersDocument, {});

	return data.data?.statistics_collection[0].totalPlayers;
};

// Define the interface for the date range
export interface DateRange {
	start: number;
	end: number;
}

type ProfitDynamicDistributionResponse = ExecutionResult<Record<`profitDistribution${number}`, GetTotalConservativeDistributionsQuery['profitDistributions']>>;
export const fetchDynamicStakingTotalDistribution = async (ranges: DateRange[]) => {
	logger.log('[statistics]', 'Fetching staking total distribution series');

	// Prepare the variables
	const variables = {} as Record<string, number>;

	// Construct the query string dynamically
	let query = 'query GetTotalDynamicDistributions(';

	// Dynamically add variables and the query for each range
	ranges.forEach((_, index) => {
		const rangeIndex = index + 1; // Start from 1 for human-readable aliases
		query += `$start${rangeIndex}: BigInt!, $end${rangeIndex}: BigInt!, `;
	});

	// Remove trailing comma
	query = query.slice(0, -2);
	query += ') {';

	// Add profitDistribution fields for each range dynamically
	ranges.forEach((_, index) => {
		const rangeIndex = index + 1;
		query += `
		profitDistribution${rangeIndex}: profitDistributionsDynamic(
		  where: { blockTimestamp_gt: $start${rangeIndex}, blockTimestamp_lt: $end${rangeIndex} }
		) {
		  pool
		  amount
		  blockNumber
		  totalStaked
		}
	  `;
	});

	query += '}';

	// Dynamically create the variables
	ranges.forEach((range, index) => {
		const rangeIndex = index + 1;
		variables[`start${rangeIndex}`] = range.start;
		variables[`end${rangeIndex}`] = range.end;
	});

	//Execute the query
	const data: ProfitDynamicDistributionResponse = await execute(query, variables);

	logger.log('[statistics]', 'Fetched staking total distribution series:', data);

	return mapAndSumResponse(data.data, ranges).filter((data) => data.value > 0);
};
type ProfitConservativeDistributionResponse = ExecutionResult<
	Record<`profitDistribution${number}`, GetTotalConservativeDistributionsQuery['profitDistributions']>
>;
export const fetchConservativeStakingTotalDistribution = async (ranges: DateRange[]) => {
	logger.log('[statistics]', 'Fetching staking total distribution series');

	// Prepare the variables
	const variables = {} as Record<string, number>;

	// Construct the query string dynamically
	let query = 'query GetTotalConservativeDistributions(';

	// Dynamically add variables and the query for each range
	ranges.forEach((_, index) => {
		const rangeIndex = index + 1; // Start from 1 for human-readable aliases
		query += `$start${rangeIndex}: BigInt!, $end${rangeIndex}: BigInt!, `;
	});

	// Remove trailing comma
	query = query.slice(0, -2);
	query += ') {';

	// Add profitDistribution fields for each range dynamically
	ranges.forEach((_, index) => {
		const rangeIndex = index + 1;
		query += `
		profitDistribution${rangeIndex}: profitDistributions(
		  where: { blockTimestamp_gte: $start${rangeIndex}, blockTimestamp_lte: $end${rangeIndex} }
		) {
		  pool
		  amount
		  blockNumber
		  totalStaked
		}
	  `;
	});

	query += '}';

	// Dynamically create the variables
	ranges.forEach((range, index) => {
		const rangeIndex = index + 1;
		variables[`start${rangeIndex}`] = range.start + 1 * 25;
		variables[`end${rangeIndex}`] = range.end;
	});

	//Execute the query
	const data: ProfitConservativeDistributionResponse = await execute(query, variables);

	logger.log('[statistics]', 'Fetched staking total distribution series:', data);

	const formattedData = mapAndSumResponse(data.data, ranges);
	return formattedData.filter((data) => data.value > 0);
};

// Helper function to sum the amounts
const sumAmounts = (distribution: Array<{ amount: string }>) => {
	return distribution.reduce((total, { amount }) => total + BigInt(amount), BigInt(0));
};

// Map and summarize the profit distributions
const mapAndSumResponse = (response: ProfitConservativeDistributionResponse['data'] | ProfitDynamicDistributionResponse['data'], ranges: DateRange[]) => {
	if (!response) return [];
	return (Object.keys(response) as `profitDistribution${number}`[]).map((category, index) => {
		// Get the current distribution array
		const distribution = response[category];

		// Sum the amounts for this category
		const totalAmount = sumAmounts(distribution);

		// Map each category to the desired structure
		return {
			label: ranges[index].start, // Placeholder for the label
			totalStaked: distribution.length ? valueToNumber(distribution[distribution.length - 1].totalStaked) : 0,

			value: valueToNumber(totalAmount), // Convert to a regular number for the chart
		};
	});
};

// Helper function to sum the volumes
const sumVolumes = (distribution: Array<{ volumeToken0: string }>) => {
	return distribution.reduce((total, { volumeToken0 }) => total + Number(volumeToken0), 0);
};
export const fetchTradingVolume = async () => {
	const data: ExecutionResult<GetTradingVolumeQuery> = await execute(GetTradingVolumeDocument, {
		first: 30,
		pool: LIQUIDITY_POOL_ADDRESS.toLowerCase(),
	});

	if (!data?.data?.pool?.poolDayData) {
		return 0n;
	}

	return sumVolumes(data.data.pool?.poolDayData);
};
