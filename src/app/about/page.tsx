import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components';
import { generateMetadata } from '@/lib/metadata';
import styles from './About.module.css';

export const metadata: Metadata = generateMetadata({
	title: 'About | Terminus Industrials',
	description: 'About Terminus Industrials - Defense-Grade Advanced Manufacturing for Critical U.S. Infrastructure',
});

export default function AboutPage() {
	return (
		<>
			<Navbar />

			<div className="form-page-container">
				<div className="form-wrapper">
					<div className={styles.aboutContent}>
						<h1 className={styles.title}>About<br className={styles.titleBreak} /> Terminus Industrials</h1>

						<div className={styles.section}>
							<p className={styles.lead}>
								Terminus Industrials is a U.S.-based advanced manufacturer focused on expanding and
								accelerating domestic production capacity for large power transformers.
							</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Our Mission</h2>
							<p className={styles.text}>
								We are building a defense-grade, highly automated manufacturing platform designed to
								produce high-voltage, high-MVA transformers faster, more reliably, and with greater
								standardization than legacy suppliers. Our mission is to secure production—with specific
								focus on resilience, surge capacity, and rapid deployment of critical assets.
							</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>The Challenge</h2>
							<p className={styles.text}>
								The National Security Council and the Department of Energy categorize transformers as
								&quot;Tier 0 Critical Infrastructure&quot;—the highest classification for assets whose loss would
								result in immediate, widespread failure of national functions.
							</p>
							<ul className={styles.list}>
								<li className={styles.listItem}>
									Lead times for large power transformers extend up to seven years with total backlog
									exceeding $10 billion across domestic utilities
								</li>
								<li className={styles.listItem}>
									Over 80% of LPT supply is international, with estimates suggesting over 90% of
									components in U.S.-assembled units are foreign-sourced
								</li>
								<li className={styles.listItem}>
									Single substation outages could leave cities without power for months, while 9-15
									critically located outages could compromise the entire nation&apos;s grid
								</li>
								<li className={styles.listItem}>
									Over 75% of current U.S. LPT production facilities are more than 20 years old, with
									many facilities 40-60+ years old
								</li>
							</ul>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Our Approach</h2>
							<p className={styles.text}>
								Terminus is integrating modern software and automation, digital-twin engineering, and
								secure America-first supply chains to address long lead times, aging infrastructure, and
								national-security vulnerabilities in the U.S. electric grid.
							</p>
							<div className={styles.approachGrid}>
								<div className={styles.approachCard}>
									<h3 className={styles.approachTitle}>Automated Production</h3>
									<p className={styles.approachText}>
										Industrial robotics driving core cutting, assembly, and testing—accelerating
										production timelines while reducing labor costs. Engineering new methods for
										insulation, coil winding, and final assembly for end-to-end autonomous production.
									</p>
								</div>
								<div className={styles.approachCard}>
									<h3 className={styles.approachTitle}>Supply Chain Security</h3>
									<p className={styles.approachText}>
										Reliable steel and copper supply through high-volume orders and warehousing.
										In-housing production of modular components to eliminate third-party cost premiums
										and delivery risks.
									</p>
								</div>
								<div className={styles.approachCard}>
									<h3 className={styles.approachTitle}>FOUNDATION OS</h3>
									<p className={styles.approachText}>
										Our in-house operating system serves as an integrated ERP and MES, with AI/ML
										driving autonomous processes. Designed for rapid design, iteration, production,
										and delivery of engineer-to-order large power transformers.
									</p>
								</div>
								<div className={styles.approachCard}>
									<h3 className={styles.approachTitle}>High-Volume Rapid Delivery</h3>
									<p className={styles.approachText}>
										Over 80% reduction in engineering timelines vs existing OEMs. Design timelines
										from ~150 days to ~15 minutes. Production timelines from ~4 months to ~10 days.
									</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}
