import { useGetTotalPlayers } from '@/src/lib/query/statistics';
import { cn } from '@betfinio/components';
import { useTranslation } from 'react-i18next';
import { InfoCard } from './InfoCard';

export const TotalPlayersCard = () => {
	const { data, isLoading } = useGetTotalPlayers();
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });
	return (
		<div
			className={cn({
				blur: isLoading,
			})}
		>
			<InfoCard titleType="user" title={data ?? 0} header={t('totalPlayers')} tooltipContent={[t('totalPlayersTooltip')]} />
		</div>
	);
};
