import { useGetCurrentDistribution } from '@/src/lib/query/statistics';
import { cn } from 'betfinio_app/lib/utils';
import cx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoCard } from './InfoCard';

export const FreeBetCirculation: React.FC = () => {
	const { data, isLoading } = useGetCurrentDistribution();
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });
	const result = useMemo(() => {
		if (!data) return 0n;
		const [_, freeTokens, staked, lockedLiquidity] = data;
		return freeTokens + staked + lockedLiquidity;
	}, [data]);

	return (
		<div className={cn({ blur: isLoading })}>
			<InfoCard titleType="currency" title={result} header={t('circulatingSupply')} tooltipContent={[t('circulatingSupplyTooltip')]} />
		</div>
	);
};
