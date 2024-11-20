import { useGetLiquidtyInPool } from '@/src/lib/query/statistics';
import { valueToNumber } from '@betfinio/abi';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import { InfoCard } from './InfoCard';

export const LiquidityInPoolCard: React.FC = () => {
	const { data, isLoading } = useGetLiquidtyInPool();
	const { t } = useTranslation('staking', { keyPrefix: 'statistics' });

	const title2 = data.usdtResult;

	return (
		<div
			className={cx({
				blur: isLoading,
			})}
		>
			<InfoCard
				titleType="currency"
				title={valueToNumber(title2, 6)}
				withIcon={false}
				titlePostFix={'USDT'}
				postfix="USDT"
				header={t('liquidityInPool')}
				tooltipContent={[t('liquidityInPoolTooltip')]}
			/>
		</div>
	);
};
