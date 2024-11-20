import { valueToNumber } from '@betfinio/abi';
import { Bet, type IconProps, Referer } from '@betfinio/ui/dist/icons';
import { BetValue } from 'betfinio_app/BetValue';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'betfinio_app/tooltip';
import cx from 'clsx';
import { motion } from 'framer-motion';
import { UserIcon } from 'lucide-react';
import millify from 'millify';
import type { FC } from 'react';

interface IInfoCardProps {
	header: string;
	title: string | number | bigint;
	titlePostFix?: string;
	postfix?: string;
	withIcon?: boolean;
	subtitle?: string;
	tooltipContent: string[];
	titleType?: 'currency' | 'user' | 'currencyPair';
	Icon?: FC<IconProps>;
}
export const InfoCard: FC<IInfoCardProps> = ({
	header,
	title,
	titlePostFix,
	postfix,
	withIcon = true,
	subtitle,
	tooltipContent,
	titleType,
	Icon = Referer,
}) => {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip open={false}>
				<motion.div className="relative border border-border py-3 flex flex-col  gap-2 h-full items-center bg-card rounded-lg">
					<p className={'text-xs text-tertiary-foreground'}>{header}</p>
					<Icon className={'w-10 h-10 text-accent-secondary-foreground'} />
					<div className={cx(' flex-grow text-base lg:text-lg font-semibold text-center flex flex-wrap items-center justify-center gap-1 text-foreground')}>
						{!titleType && <span>{title.toString()}</span>}
						{titleType === 'currency' && <BetValue value={title as bigint} withIcon={withIcon} postfix={postfix} />}
						{titlePostFix && <span>{titlePostFix}</span>}

						{titleType === 'user' && (
							<>
								{title}
								<UserIcon className={'w-4 h-4 text-accent-secondary-foreground'} />
							</>
						)}
					</div>

					{subtitle && <p className={'text-xs text-foreground'}>{subtitle}</p>}
					<span
						className={
							'!hidden absolute right-4 top-2 border-2 text-tertiary-foreground border-current font-semibold text-xs w-[18px] h-[18px] flex items-center justify-center rounded-full'
						}
					>
						<TooltipTrigger>?</TooltipTrigger>
					</span>
				</motion.div>
				<TooltipContent>
					<div className={'p-4 text-xs max-w-[90vw] leading-5 '}>
						{tooltipContent.map((content, index) => (
							<p key={index}>{content}</p>
						))}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
