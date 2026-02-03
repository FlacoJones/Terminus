import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components';
import styles from '../[slug]/CareerDetail.module.css';

export const metadata: Metadata = {
	title: 'Chief Technology Officer | Careers | Terminus Industrials',
	description: 'Join Terminus Industrials as Chief Technology Officer - Define and own the full technology stack for defense-grade advanced manufacturing',
	openGraph: {
		title: 'Chief Technology Officer | Careers | Terminus Industrials',
		description: 'Join Terminus Industrials as Chief Technology Officer - Define and own the full technology stack for defense-grade advanced manufacturing',
		images: ['/logo.svg'],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Chief Technology Officer | Careers | Terminus Industrials',
		description: 'Join Terminus Industrials as Chief Technology Officer - Define and own the full technology stack for defense-grade advanced manufacturing',
		images: ['/logo.svg'],
	},
};

export default function CTOPage() {
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
							<h1 className={styles.title}>Chief Technology Officer</h1>
							<p className={styles.location}>Central Texas (Greater Austin region)</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>About Terminus Industrials</h2>
							<p className={styles.text}>
								Terminus Industrials is a defense-grade advanced manufacturer, automating heavy-industrial
								production for critical U.S. infrastructure. Our first facility will produce Large Power
								Transformers (≥100 MVA, 34.5 kV–765 kV class), delivering the precision, reliability, and
								speed required to strengthen and expand America&apos;s grid. We are building the first automated
								LPT manufacturing platform in the United States uniting modern robotics and digital twin
								design to meet growing demand for transformer production and deployment.
							</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Job Description</h2>
							<p className={styles.text}>
								The Chief Technology Officer is a founding executive responsible for defining and owning
								Terminus&apos; full technology stack—from transformer design software and digital twins to factory
								automation, controls, data systems, and AI-driven optimization. This role unifies product
								engineering, manufacturing automation, and software under a single technical vision.
							</p>
							<br />
							<p className={styles.text}>
								The CTO is accountable for turning first-principles transformer physics and manufacturing
								processes into a scalable, software-defined production platform (&quot;FOUNDATION OS&quot;) that enables
								rapid design iteration, automated fabrication, closed-loop testing, and continuous improvement.
							</p>
							<br />
							<p className={styles.text}>
								This role is foundational to Terminus&apos; ability to: (i) Achieve step-change reductions in LPT
								lead times; (ii) Automate traditionally manual heavy-industrial processes; (iii) Scale output
								without linear headcount growth; and (iv) Establish a durable, technology-based moat versus incumbents.
							</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Key Responsibilities</h2>
							<ul className={styles.list}>
								<li className={styles.listItem}>
									<strong>Technical Leadership & Execution:</strong> Build and lead teams across automation,
									controls, applied software, and advanced manufacturing; Set technical standards, development
									velocity, and system-level accountability; Act as final technical decision-maker for factory
									and product technology choices
								</li>
								<li className={styles.listItem}>
									<strong>Technology Strategy & Architecture:</strong> Lead development of the internal LPT
									design and manufacturing platform (parametric electrical, mechanical, thermal, and dielectric
									models); Own integration of CAD/CAE, BOM generation, routing, work instructions, and cost
									models; Ensure closed-loop feedback between design, production, and test results
								</li>
								<li className={styles.listItem}>
									Design the end-to-end technical architecture spanning design software, digital twins, factory
									automation, robotics, controls, data infrastructure, and analytics; Own the long-term technology
									roadmap aligned to product, factory scale-up, and regulatory requirements
								</li>
								<li className={styles.listItem}>
									<strong>Product–Manufacturing Integration:</strong> Ensure transformer designs are natively
									optimized for automated manufacturing; Partner with Product Engineering to standardize
									architectures, modules, and interfaces; Drive Design-for-Automation and Design-for-Test
									across all products
								</li>
								<li className={styles.listItem}>
									<strong>Factory Automation & Industrial Controls:</strong> Architect and deploy automation
									across winding, core assembly, insulation, tank fabrication, drying, oil filling, and test
									operations; Define standards for PLCs, robotics, sensors, machine vision, and industrial
									networks; Ensure automation systems meet reliability, safety, and inspectability requirements
								</li>
								<li className={styles.listItem}>
									<strong>Manufacturing Data & Optimization:</strong> Define machine-level and process-level
									data capture required for yield, quality, and throughput optimization; Apply modeling,
									simulation, and ML techniques to loss reduction, defect prevention, and cycle-time compression;
									Enable real-time visibility into production and test performance
								</li>
								<li className={styles.listItem}>
									<strong>External Technical Interface:</strong> Represent Terminus&apos; manufacturing and product
									technology with utilities, regulators, national labs, and strategic partners; Support technical
									diligence with investors and federal stakeholders; Evaluate and integrate third-party
									manufacturing technologies where advantageous
								</li>
							</ul>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Required Qualifications</h2>
							<ul className={styles.list}>
								<li className={styles.listItem}>
									12–20+ years in advanced manufacturing, industrial automation, robotics, or complex
									electromechanical systems; with at least 5 years of experience leading teams in an
									innovative, fast-paced environment
								</li>
								<li className={styles.listItem}>
									Proven experience building software-defined production systems or highly automated factories
									and track record of taking complex systems from concept to production scale
								</li>
								<li className={styles.listItem}>
									Hands-on experience with industrial controls, robotics, or high-throughput automated lines
								</li>
								<li className={styles.listItem}>
									Prior CTO, VP Engineering, or equivalent senior technical leadership role in a scaling company
									with experience operating in regulated, safety-critical, or infrastructure-grade environments,
									power systems, transformers, grid infrastructure, aerospace, defense, or semiconductor
									manufacturing (ex - SpaceX, Tesla, Anduril)
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
