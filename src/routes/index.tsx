import { BetTokenCurrentDistribution } from '@/src/components/statistics/BetTokenCurrentDistribution';
import { BetTokenEmissionChart } from '@/src/components/statistics/BetTokenEmission';
import { ConservativeStakingPayouts } from '@/src/components/statistics/ConservativeStakingPayouts';
import { DynamicStakingPayouts } from '@/src/components/statistics/DynamicStakingPayouts';
import Revenues from '@/src/components/statistics/Revenues';
import { FreeBetCirculation } from '@/src/components/statistics/SmallCards/FreeBetCircualtion';
import { LiquidityInPoolCard } from '@/src/components/statistics/SmallCards/LiquidityInPoolCard';
import { TotalAffiliatePaid } from '@/src/components/statistics/SmallCards/TotalAffiliatePaid';
import { TotalMembersCard } from '@/src/components/statistics/SmallCards/TotalMemebrsCard';
import { TotalPlayersCard } from '@/src/components/statistics/SmallCards/TotalPlayersCard';
import { TotalRevenueCard } from '@/src/components/statistics/SmallCards/TotalRevenueCard';
import { TotalStakedCard } from '@/src/components/statistics/SmallCards/TotalStakedCard';
import { TotalStakersCard } from '@/src/components/statistics/SmallCards/TotalStakersCard';
import { TradingVolumeCard } from '@/src/components/statistics/SmallCards/TradingVolumeCard';
import Staked from '@/src/components/statistics/Staked';
import Stakers from '@/src/components/statistics/Stakers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@betfinio/components/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
	component: StatisticsPage,
});

function StatisticsPage() {
	const { t } = useTranslation('staking');

	const [payoutsTab, setPayoutsTab] = useState('dynamicPayouts');

	return (
		<div className={'p-2 md:p-3 lg:p-4 flex flex-col gap-2 md:gap-3 lg:gap-4'}>
			<div className={'grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4'}>
				<TotalMembersCard />
				<TotalStakersCard />
				<TotalPlayersCard />
			</div>

			<div className={'grid grid-cols-1 gap-2 md:gap-3 lg:gap-4'}>
				<Tabs value={payoutsTab}>
					<TabsList className={'md:flex flex-row gap-2 text-sm hidden'}>
						<TabsTrigger className="w-full sm:w-auto" onClick={() => setPayoutsTab('dynamicPayouts')} value={'dynamicPayouts'}>
							{t('statistics.dynamicStakingPayouts')}
						</TabsTrigger>
						<TabsTrigger className="w-full sm:w-auto" onClick={() => setPayoutsTab('conservativePayouts')} value={'conservativePayouts'}>
							{t('statistics.conservativeStakingPayouts')}
						</TabsTrigger>
						<TabsTrigger className="w-full sm:w-auto" onClick={() => setPayoutsTab('revenues')} value={'revenues'}>
							{t('statistics.totalRevenues')}
						</TabsTrigger>
					</TabsList>

					<div className="md:hidden text-lg ">{t('statistics.revenues')}</div>
					<TabsList className={'flex md:hidden'}>
						<TabsTrigger className="w-full sm:w-auto" onClick={() => setPayoutsTab('dynamicPayouts')} value={'dynamicPayouts'}>
							{t('statistics.dynamic')}
						</TabsTrigger>
						<TabsTrigger className="w-full sm:w-auto" onClick={() => setPayoutsTab('conservativePayouts')} value={'conservativePayouts'}>
							{t('statistics.conservative')}
						</TabsTrigger>
						<TabsTrigger className="w-full sm:w-auto" onClick={() => setPayoutsTab('revenues')} value={'revenues'}>
							{t('statistics.total')}
						</TabsTrigger>
					</TabsList>

					<TabsContent value={'conservativePayouts'} className={'h-full'}>
						<ConservativeStakingPayouts />
					</TabsContent>
					<TabsContent value={'dynamicPayouts'} className={'h-full'}>
						<DynamicStakingPayouts />
					</TabsContent>
					<TabsContent value={'revenues'} className={'h-full'}>
						<Revenues />
					</TabsContent>
				</Tabs>
			</div>
			<div className={'grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4'}>
				<TotalStakedCard />
				<TotalRevenueCard />
				<TotalAffiliatePaid />
			</div>

			<div className={'grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3 lg:gap-4'}>
				<Staked />
				<Stakers />
			</div>
			<div className={'grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4'}>
				<FreeBetCirculation />
				<TradingVolumeCard />
				<LiquidityInPoolCard />
			</div>

			<div className={'grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4'}>
				<BetTokenEmissionChart />
				<BetTokenCurrentDistribution />
			</div>
		</div>
	);
}
