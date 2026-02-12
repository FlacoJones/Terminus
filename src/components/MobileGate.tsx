'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function MobileGate({ children }: { children: React.ReactNode }) {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	// Don't render anything until we know (avoids flash)
	if (isMobile === null) return null;

	if (isMobile) {
		return (
			<div className="mobile-gate">
				<div className="mobile-gate-content">
					<h1 className="mobile-gate-title">TERMINUS</h1>
					<h2 className="mobile-gate-subtitle">INDUSTRIALS</h2>
					<div className="mobile-gate-divider" />
					<p className="mobile-gate-message">
						Advance Purchase Indication platform only available on desktop
						browsers.
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
