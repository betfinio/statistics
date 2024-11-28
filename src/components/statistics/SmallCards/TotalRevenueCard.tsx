import { useRevenueStatisticsCurrent } from '@/src/lib/query/statistics';
import { cn } from '@betfinio/components';
import { useTranslation } from 'react-i18next';
import { InfoCard } from './InfoCard';
export const TotalRevenueCard = () => {
	const { data, isLoading } = useRevenueStatisticsCurrent();
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });

	return (
		<div
			className={cn({
				blur: isLoading,
			})}
		>
			<InfoCard titleType="currency" title={data?.sum ?? 0} header={t('totalEarned')} tooltipContent={[t('totalEarnedTooltip')]} />
		</div>
	);
};
