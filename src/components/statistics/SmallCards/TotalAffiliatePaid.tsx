import { useGetTotalAffiliatePaid } from '@/src/lib/query/statistics';

import { cn } from '@betfinio/components';
import { useTranslation } from 'react-i18next';
import { InfoCard } from './InfoCard';
export const TotalAffiliatePaid = () => {
	const { data, isLoading } = useGetTotalAffiliatePaid();
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });
	return (
		<div
			className={cn({
				blur: isLoading,
			})}
		>
			<InfoCard titleType="currency" title={data ?? 0} header={t('totalAffiliatePaid')} tooltipContent={[t('totalAffiliatePaidTooltip')]} />
		</div>
	);
};
