import logger from '@/src/config/logger';
import { useBalance } from '@/src/lib/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

export const Route = createFileRoute('/')({
	component: () => <Index />,
});

function Index() {
	// example of using i18n
	const { t } = useTranslation('template');
	// example of using wagmi
	const { address = ZeroAddress } = useAccount();
	// example of using query
	const { data: balance = 0n } = useBalance(address);
	// example of using logger
	logger.success('Hello, world!');
	return (
		<div className={'border border-red-roulette px-4 py-2 rounded-md text-white h-full'}>
			{t('title')}
			<div className={'border border-yellow-400 p-4'}>Your balance: {valueToNumber(balance)} POL</div>
		</div>
	);
}
