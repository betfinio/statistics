import { useGetTotalConservativeDistribution, useGetTotalDynamicDistribution } from '@/src/lib/query/statistics';
import { getConservativeCyclesBack, getDynamicCycles } from '@/src/utils';
import { cn } from '@betfinio/components';
import { Bet } from '@betfinio/components/icons';
import { type BarTooltipProps, ResponsiveBar } from '@nivo/bar';
import { DateTime } from 'luxon';
import millify from 'millify';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface IDataPoint {
	id: string;
	label: string;
	value: number;
	color: string;
	textColor: string;
	legendColor: string;
}
const cycles28Back = getConservativeCyclesBack(28);
const { validCycles } = getDynamicCycles();

const Revenues = () => {
	const { t } = useTranslation('staking');
	const { data: totalDistribution = [] } = useGetTotalConservativeDistribution(cycles28Back);
	const { data: totalDynamicDistribution = [] } = useGetTotalDynamicDistribution(validCycles);

	const [showDynamic, setShowDynamic] = useState(true);
	const [showConservative, setShowConservative] = useState(true);

	const formatedData = useMemo(() => {
		const conservative = totalDistribution.map((item) => ({
			label: item.label,
			value: item.value,
			totalStaked: item.totalStaked,
			percentage: (item.value / item.totalStaked) * 100,
			type: 'conservative' as const,
			color: 'hsl(var(--chart-1))',
		}));
		const dynamic = totalDynamicDistribution.map((item) => ({
			label: item.label,
			value: item.value,
			totalStaked: item.totalStaked,
			percentage: (item.value / item.totalStaked) * 100,
			type: 'dynamic' as const,
			color: 'hsl(var(--chart-2))',
		}));

		return [...(showConservative ? conservative : []), ...(showDynamic ? dynamic : [])].sort((a, b) => a.label - b.label);
	}, [totalDistribution, totalDynamicDistribution, showDynamic, showConservative]);

	return (
		<div className={'border border-border rounded-lg w-full p-2'}>
			<div className={' aspect-video h-[400px] w-full'}>
				<ResponsiveBar
					data={formatedData}
					keys={['percentage']}
					indexBy="label"
					enableGridX={false}
					enableGridY={false}
					borderRadius={2}
					margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
					padding={0.3}
					axisBottom={{
						format: (value) => {
							const dataItem = formatedData.find((item) => item.label === value);
							if (dataItem) {
								return dataItem.type === 'dynamic' ? DateTime.fromSeconds(value).toFormat('dd.MM') : '';
							}
							return '';
						},
						tickRotation: 45,
					}}
					axisLeft={{
						format: (value) => millify(value, { precision: 2 }),
					}}
					tooltip={Tooltip}
					labelSkipWidth={12}
					labelSkipHeight={12}
					valueFormat={() => ''}
					colors={(d) => d.data.color}
				/>
			</div>
			<div className="flex justify-center gap-4 text-xs">
				<div
					className="flex items-center gap-1 hover:cursor-pointer "
					onClick={() => {
						setShowConservative(!showConservative);
					}}
				>
					<span
						className={cn('w-3 h-3 flex rounded-full', {
							'bg-[hsl(var(--chart-1))]': showConservative,
							'bg-[hsl(var(--chart-1))]/50': !showConservative,
						})}
					/>
					<span
						className={cn({
							'text-foreground': showConservative,
							'text-tertiary-foreground': !showConservative,
						})}
					>
						{t('statistics.conservative')}
					</span>
				</div>
				<div
					className="flex items-center gap-1 hover:cursor-pointer"
					onClick={() => {
						setShowDynamic(!showDynamic);
					}}
				>
					<span
						className={cn('w-3 h-3 flex rounded-full', {
							'bg-[hsl(var(--chart-2))]': showDynamic,
							'bg-[hsl(var(--chart-2))]/50': !showDynamic,
						})}
					/>
					<span
						className={cn({
							'text-foreground': showDynamic,
							'text-tertiary-foreground': !showDynamic,
						})}
					>
						{t('statistics.dynamic')}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Revenues;

// Custom Tooltip Component
const Tooltip = (
	props: BarTooltipProps<{
		label: number;
		value: number;
		totalStaked: number;
		color: string;
		type: 'conservative' | 'dynamic';
	}>,
) => {
	const { t } = useTranslation('staking');

	const { color, data } = props;

	return (
		<div className="flex flex-col gap-1 bg-card rounded-lg px-2 py-1 text-sm">
			{/* Display the formatted date */}
			<div className="flex items-center justify-between gap-2">
				<div className={cn(' ')} style={{ color: color }}>
					{t(`statistics.${data.type}`)}
				</div>
				<div className="text-xs">{DateTime.fromSeconds(data.label).toFormat('dd.MM')}</div>
			</div>
			<div className="flex justify-between items-center gap-2">
				<div className="text-xs flex gap-1 items-center">
					{data.value.toLocaleString()}
					<Bet className={'w-3 h-3 text-secondary-foreground'} />
				</div>
				<div className="text-xs flex gap-1 items-center">{((data.value / data.totalStaked) * 100).toFixed(3)}%</div>
			</div>
		</div>
	);
};
