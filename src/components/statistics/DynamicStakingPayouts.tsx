import { useGetTotalDynamicDistribution } from '@/src/lib/query/statistics';
import { getDynamicCycles } from '@/src/utils';
import { cn } from '@betfinio/components';
import { Bet } from '@betfinio/components/icons';
import { type BarTooltipProps, ResponsiveBar } from '@nivo/bar';
import { DateTime } from 'luxon';
import millify from 'millify';
import { useTranslation } from 'react-i18next';

const { validCycles } = getDynamicCycles();
export const DynamicStakingPayouts = () => {
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });
	const { data: totalDistribution } = useGetTotalDynamicDistribution(validCycles);

	return (
		<div className={'border border-border rounded-lg aspect-video h-[400px] w-full p-2'}>
			<ResponsiveBar
				data={totalDistribution ?? []}
				keys={['value']}
				indexBy="label"
				enableGridX={false}
				enableGridY={false}
				borderRadius={2}
				margin={{ top: 20, right: 30, bottom: 70, left: 50 }}
				padding={0.3}
				axisBottom={{
					format: (value) => DateTime.fromSeconds(value).toFormat('dd.MM'),
					tickRotation: 45,
				}}
				axisLeft={{
					format: (value) => millify(value, { precision: 2 }),
				}}
				tooltip={Tooltip}
				labelSkipWidth={12}
				labelSkipHeight={12}
				valueFormat={() => ''}
				colors={'hsl(var(--chart-2))'}
			/>
		</div>
	);
};

// Custom Tooltip Component
const Tooltip = (props: BarTooltipProps<{ label: number; value: number; totalStaked: number }>) => {
	const { t } = useTranslation('staking');
	const { color, data } = props;

	return (
		<div className="flex flex-col gap-1 bg-card rounded-lg px-2 py-1 text-sm">
			{/* Display the formatted date */}
			<div className="flex justify-between items-center gap-2">
				<div className={cn('')} style={{ color: color }}>
					{t('statistics.dynamic')}
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
