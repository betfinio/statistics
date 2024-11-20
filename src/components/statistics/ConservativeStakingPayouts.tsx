import { useGetTotalConservativeDistribution } from '@/src/lib/query/statistics';
import { getConservativeCyclesBack } from '@/src/utils';
import { Bet } from '@betfinio/ui/dist/icons';
import { type BarTooltipProps, ResponsiveBar } from '@nivo/bar';
import { useMediaQuery } from 'betfinio_app/lib/utils';
import cx from 'clsx';
import { DateTime } from 'luxon';
import millify from 'millify';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Getcycles back
const cycles28Back = getConservativeCyclesBack(28);

export const ConservativeStakingPayouts: FC = () => {
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });

	const { data: totalDistribution } = useGetTotalConservativeDistribution(cycles28Back);

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
				colors={'hsl(var(--chart-1))'}
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
			<div className="flex items-center justify-between gap-2">
				<div className={cx(' ')} style={{ color: color }}>
					{t('statistics.conservative')}
				</div>
				<div className="text-xs">{DateTime.fromSeconds(data.label).toFormat('dd.MM')}</div>
			</div>
			<div className="flex justify-between items-center gap-2">
				<div className="text-xs flex gap-1 items-center">
					{data.value.toLocaleString()}
					<Bet className={'w-3 h-3 text-accent-secondary-foreground'} />
				</div>
				<div className="text-xs flex gap-1 items-center">{((data.value / data.totalStaked) * 100).toFixed(3)}%</div>
			</div>
		</div>
	);
};
