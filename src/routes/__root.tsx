import instance from '@/src/i18n.ts';
import { Toaster } from '@betfinio/components/ui';
import { createRootRoute } from '@tanstack/react-router';
import { Root } from 'betfinio_app/root';
import { VersionValidation } from '../components/VersionValidation';

export const Route = createRootRoute({
	component: () => (
		<Root id={'statistics'} instance={instance}>
			<Toaster />
			<VersionValidation repository={'statistics'} branch={import.meta.env.PUBLIC_BRANCH} current={import.meta.env.PUBLIC_DEPLOYED} />
		</Root>
	),
});
