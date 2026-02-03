import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components';
import styles from '../[slug]/CareerDetail.module.css';

export const metadata: Metadata = {
	title: 'Head of Product Engineering | Careers | Terminus Industrials',
	description: 'Join Terminus Industrials as Head of Product Engineering - Lead design, materials, and manufacturability for Large Power Transformers',
	openGraph: {
		title: 'Head of Product Engineering | Careers | Terminus Industrials',
		description: 'Join Terminus Industrials as Head of Product Engineering - Lead design, materials, and manufacturability for Large Power Transformers',
		images: ['/logo.png'],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Head of Product Engineering | Careers | Terminus Industrials',
		description: 'Join Terminus Industrials as Head of Product Engineering - Lead design, materials, and manufacturability for Large Power Transformers',
		images: ['/logo.png'],
	},
};

export default function HeadOfProductEngineeringPage() {
	return (
		<>
			<Navbar />

			<div className="form-page-container">
				<div className="form-wrapper">
					<div className={styles.careerContent}>
						<Link href="/careers" className={styles.backLink}>
							← Back to Careers
						</Link>

						<div className={styles.header}>
							<h1 className={styles.title}>Head of Product Engineering – Large Power Transformers</h1>
							<p className={styles.location}>Central Texas (Greater Austin region)</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>About Terminus Industrials</h2>
							<p className={styles.text}>
								Terminus Industrials is a defense-grade advanced manufacturer, automating heavy-industrial
								production for critical U.S. infrastructure. Our first facility will produce Large Power
								Transformers (≥100 MVA, 34.5 kV–500 kV class), delivering the precision, reliability, and
								speed required to strengthen and expand America&apos;s grid. We are building the first automated
								LPT manufacturing platform in the United States uniting modern robotics and digital twin
								design to meet growing demand for transformer production and deployment.
							</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Job Description</h2>
							<p className={styles.text}>
								The Head of Product Engineering will join the founding team to lead all design, materials,
								and manufacturability initiatives for Terminus&apos; transformer product line. This role will
								define the company&apos;s technical DNA - translating decades of power-engineering know-how into
								modern, automated, and scalable production.
							</p>
							<br />
							<p className={styles.text}>
								This is a critical leadership role, necessary to architect Terminus&apos; first generation of
								100–500 MVA power transformers, establish internal design standards, and integrate advanced
								design tools (CAD, FEA, digital twins) with manufacturing automation.
							</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Key Responsibilities</h2>
							<ul className={styles.list}>
								<li className={styles.listItem}>
									<strong>Product Design Leadership:</strong> Lead end-to-end electrical and mechanical design
									of LPTs (core, windings, tank, OLTC, bushings, cooling, insulation systems)
								</li>
								<li className={styles.listItem}>
									<strong>Design for Manufacturability:</strong> Translate design requirements into scalable
									manufacturing workflows optimized for automation, repeatability, and quality
								</li>
								<li className={styles.listItem}>
									<strong>System Integration:</strong> Define and validate electrical, thermal, and mechanical
									performance parameters for ≥100 MVA, 34.5–500 kV transformers
								</li>
								<li className={styles.listItem}>
									<strong>Toolchain Development:</strong> Implement advanced modeling and simulation environments
									with Digital Infrastructure team (e.g., SolidWorks, COMSOL, ANSYS Maxwell, EMTP-RV)
								</li>
								<li className={styles.listItem}>
									<strong>Compliance & Standards:</strong> Ensure adherence to IEEE, ANSI, IEC, DOE, and utility
									specifications; lead design qualification and type testing programs
								</li>
								<li className={styles.listItem}>
									<strong>Supplier & Utility Interface:</strong> Support technical engagement with utilities,
									EPCs, and component vendors (core steel, windings, insulation, bushings, OLTC, etc.)
								</li>
								<li className={styles.listItem}>
									<strong>Team Building:</strong> Recruit, mentor, and grow the core transformer design and
									product-engineering team
								</li>
							</ul>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Desired Qualifications</h2>
							<ul className={styles.list}>
								<li className={styles.listItem}>
									10+ years experience in power transformer design/manufacturing, preferably at Siemens Energy,
									ABB/Hitachi Energy, GE Grid Solutions, WEG, or a major utility/EPC (Burns & McDonnell,
									Black & Veatch, etc.)
								</li>
								<li className={styles.listItem}>
									Deep understanding of core/winding design, insulation coordination, dielectric testing,
									loss optimization, and thermal management
								</li>
								<li className={styles.listItem}>
									Proficiency with transformer design software (e.g., EFACE, Flux, ANSYS Maxwell, COMSOL,
									or in-house proprietary tools)
								</li>
								<li className={styles.listItem}>
									Strong grasp of Design for Manufacturability (DfM) and familiarity with automated or
									semi-automated production methods
								</li>
								<li className={styles.listItem}>
									Bachelor&apos;s or Master&apos;s in Electrical Engineering (Power Systems focus); PhD or PE license preferred
								</li>
								<li className={styles.listItem}>
									U.S. citizenship or permanent residency (due to defense-grade program requirements)
								</li>
							</ul>
						</div>

						<div className={styles.applySection}>
							<p className={styles.applyText}>
								Interested in this position? We&apos;d love to hear from you.
							</p>
							<Link href="/contact-us" className={styles.applyLink}>
								Contact Us to Apply
							</Link>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}
