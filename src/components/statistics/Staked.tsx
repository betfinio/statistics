import { useStakedStatisticsCurrent, useStakingStatistics } from '@/src/lib/query/statistics';
import { ResponsiveLine, type Serie, type SliceTooltipProps } from '@nivo/line';

import type { Timeframe } from '@/src/lib/types';
import { cn } from '@betfinio/components';
import { Bet } from '@betfinio/components/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@betfinio/components/ui';
import { DateTime } from 'luxon';
import millify from 'millify';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Staked = () => {
	const { t } = useTranslation('staking');
	const [timeframe, setTimeframe] = useState<Timeframe>('week');

	const { data: statistics = [], isLoading: isStatisticsLoading } = useStakingStatistics(timeframe);
	const { data: currentStatistic, isLoading: isCurrentStatisticsLoading } = useStakedStatisticsCurrent();
	const conservativeData = useMemo(() => {
		if (isStatisticsLoading || isCurrentStatisticsLoading) {
			return [];
		}
		if (!currentStatistic) return [];
		return statistics.map((item) => {
			return {
				x: item.timestamp,
				y: item.conservativeTotalStaked,
			};
		});
	}, [statistics, currentStatistic]);

	const dynamicData = useMemo(() => {
		if (isStatisticsLoading || isCurrentStatisticsLoading) {
			return [];
		}
		if (!currentStatistic) return [];
		return statistics.map((item) => {
			return {
				x: item.timestamp,
				y: item.dynamicTotalStaked,
			};
		});
	}, [statistics, currentStatistic]);

	const data: Serie[] = [
		{
			id: t('statistics.conservative'),
			color: 'hsl(var(--chart-1))',
			data: conservativeData,
		},
		{
			id: t('statistics.dynamic'),
			color: 'hsl(var(--chart-2))',
			data: dynamicData,
		},
	];

	const handleChange = (val: Timeframe) => {
		setTimeframe(val);
	};

	return (
		<div className={'border border-border rounded-lg aspect-video p-2'}>
			<div className={'text-lg flex flex-row justify-between'}>
				<div className={'px-1'}>{t('statistics.totalStaked')}</div>
				<Select defaultValue={'week'} onValueChange={handleChange}>
					<SelectTrigger className={'max-w-[100px]'}>
						<SelectValue placeholder="Timeframe" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="hour">1 {t('hour')}</SelectItem>
						<SelectItem value="day">1 {t('day')}</SelectItem>
						<SelectItem value="week">1 {t('week')}</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<ResponsiveLine
				key={timeframe}
				data={data}
				margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
				curve={'monotoneX'}
				colors={{ datum: 'color' }}
				enableGridX={false}
				enableGridY={false}
				axisTop={null}
				isInteractive={true}
				axisRight={null}
				axisLeft={{
					format: (value) => millify(value, { precision: 2 }),
				}}
				axisBottom={{
					format: (value) => DateTime.fromSeconds(value).toFormat(timeframe === 'hour' ? 'HH:mm' : 'dd.MM'),
					tickRotation: 45,
				}}
				yScale={{
					type: 'linear',
					min: 'auto', // Can be a specific value, e.g., 50
					max: 'auto', // Can be a specific value, e.g., 100
				}}
				animate={true}
				enableTouchCrosshair={true}
				enableSlices={'x'}
				pointSize={0}
				sliceTooltip={Tooltip}
				useMesh={true}
				legends={[
					{
						anchor: 'bottom',
						direction: 'row',
						translateY: 50,
						itemsSpacing: 0,
						itemDirection: 'left-to-right',
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						toggleSerie: true,
						symbolSize: 12,
						symbolShape: 'circle',
						symbolBorderColor: 'rgba(255, 255, 255, .5)',
						effects: [
							{
								on: 'hover',
								style: {
									itemBackground: 'rgba(0, 0, 0, .03)',
									itemOpacity: 1,
								},
							},
						],
					},
				]}
			/>
		</div>
	);
};

export default Staked;

const Tooltip = ({ slice }: SliceTooltipProps) => {
	return (
		<div className={'flex flex-col gap-1 bg-card rounded-lg  px-2 py-1 text-sm '}>
			<div className={'text-xs'}>{DateTime.fromSeconds(Number(slice.points[0].data.x)).toFormat('dd.MM HH:mm')}</div>
			{slice.points.map((point, id) => (
				<div className={'flex flex-row items-center  justify-between gap-3'} key={id}>
					<div className={cn('opacity-50')} style={{ color: point.color }}>
						{point.serieId}
					</div>
					<div className={'flex flex-row items-center gap-1'}>
						{point.data.y.toLocaleString()} <Bet className={'w-3 h-3 text-secondary-foreground'} />
					</div>
				</div>
			))}
		</div>
	);
};
