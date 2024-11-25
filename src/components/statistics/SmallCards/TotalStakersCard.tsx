import { useStakersStatisticsCurrent } from '@/src/lib/query/statistics';
import { InfoCard } from './InfoCard';

import { cn } from '@betfinio/components';
import { useTranslation } from 'react-i18next';
export const TotalStakersCard = () => {
	const { data, isLoading } = useStakersStatisticsCurrent();
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });

	return (
		<div
			className={cn({
				blur: isLoading,
			})}
		>
			<InfoCard titleType="user" title={data?.sum ?? 0} header={t('totalStakers')} tooltipContent={[t('totalStakersTooltip')]} />
		</div>
	);
};
