import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components';
import styles from '../[slug]/CareerDetail.module.css';

export const metadata: Metadata = {
	title: 'Head of Quality and Test Compliance | Careers | Terminus Industrials',
	description: 'Join Terminus Industrials as Head of Quality and Test Compliance - Lead laboratory accreditation, testing procedures, and compliance systems',
	openGraph: {
		title: 'Head of Quality and Test Compliance | Careers | Terminus Industrials',
		description: 'Join Terminus Industrials as Head of Quality and Test Compliance - Lead laboratory accreditation, testing procedures, and compliance systems',
		images: ['/og-image.png'],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Head of Quality and Test Compliance | Careers | Terminus Industrials',
		description: 'Join Terminus Industrials as Head of Quality and Test Compliance - Lead laboratory accreditation, testing procedures, and compliance systems',
		images: ['/og-image.png'],
	},
};

export default function HeadOfQualityPage() {
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
							<h1 className={styles.title}>Head of Quality and Test Compliance – Large Power Transformers</h1>
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
								The Head of Quality and Test Compliance is a senior leader to design, implement, and own
								our laboratory accreditation, testing procedures, and compliance systems from first principles.
								This role is responsible for taking our transformer test facilities from greenfield to
								ISO/IEC 17025-accredited, and for establishing the technical credibility required for utility
								acceptance, DOE projects, and long-term OEM trust.
							</p>
							<br />
							<p className={styles.text}>
								This is a hands-on builder role, not a maintenance role. This role is foundational to
								Terminus Industrials&apos; ability to: (i) sell transformers to U.S. utilities, (ii) reduce
								third-party testing dependency, (iii) shorten delivery timelines, (iv) establish long-term
								technical credibility.
							</p>
							<br />
							<p className={styles.text}>
								Core goals include: (a) ISO/IEC 17025 accreditation granted for core transformer tests,
								(b) Clean utility audits with minimal findings, (c) Repeatable, defensible test data trusted
								by customers, (d) A lab that scales with production without rework.
							</p>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Key Responsibilities</h2>
							<ul className={styles.list}>
								<li className={styles.listItem}>
									<strong>Accreditation & Compliance:</strong> Lead end-to-end ISO/IEC 17025 accreditation
									for transformer testing laboratories; Define and manage scope of accreditation aligned to
									IEEE C57 standards; Serve as primary interface with accreditation bodies (A2LA / ANAB /
									equivalent); Own all audit preparation, assessments, corrective actions, and renewals
								</li>
								<li className={styles.listItem}>
									<strong>Test Procedures & Documentation:</strong> Design and author all laboratory SOPs,
									including: Loss measurement, Ratio & phase angle, Winding resistance, Temperature rise,
									Applied / induced voltage, Insulation resistance, Special tests as required; Ensure test
									methods are fully aligned with IEEE C57.12.90; Build uncertainty budgets for all accredited
									measurements; Establish test report formats acceptable to U.S. utilities
								</li>
								<li className={styles.listItem}>
									<strong>Metrology & Calibration:</strong> Define instrument selection standards (accuracy
									class, uncertainty limits); Implement NIST-traceable calibration programs; Manage calibration
									intervals, vendors, and records; Approve measurement systems and data integrity controls
								</li>
								<li className={styles.listItem}>
									<strong>Quality Management System (QMS):</strong> Build and maintain a lab-centric QMS
									compliant with ISO 17025; Own: Document control, Change management, Nonconformance & CAPA,
									Internal audits, Management review cycles; Ensure lab processes integrate cleanly with
									broader factory QA systems
								</li>
								<li className={styles.listItem}>
									<strong>Personnel Qualification & Training:</strong> Define training requirements and
									authorization matrices; Qualify and certify test engineers and technicians; Conduct
									competency evaluations and ongoing training; Act as final signatory authority for
									accredited test reports
								</li>
								<li className={styles.listItem}>
									<strong>Utility & Customer Interface:</strong> Host utility audits and witnessed tests;
									Support vendor qualification processes for major U.S. utilities; Respond to technical
									compliance questions from customers and regulators; Ensure transparency and credibility
									in all test data shared externally
								</li>
							</ul>
						</div>

						<div className={styles.section}>
							<h2 className={styles.sectionTitle}>Required Qualifications</h2>
							<ul className={styles.list}>
								<li className={styles.listItem}>
									8–15+ years in electrical testing, high-voltage labs, or transformer OEM environments
								</li>
								<li className={styles.listItem}>
									Direct experience leading ISO/IEC 17025 accreditation (not just participating)
								</li>
								<li className={styles.listItem}>
									Deep familiarity with IEEE C57 transformer testing standards
								</li>
								<li className={styles.listItem}>
									Experience working with utilities, NRTLs, or accredited test labs and experience
									accrediting impulse or partial discharge labs
								</li>
								<li className={styles.listItem}>
									Strong understanding of: (i) power transformer testing physics, (ii) measurement
									uncertainty analysis, (iii) loss measurement techniques, (iv) temperature rise testing,
									(v) high-voltage safety and grounding, and (vi) comfortable reviewing and challenging
									engineering calculations
								</li>
								<li className={styles.listItem}>
									Proven ability to build systems from scratch, Experience scaling labs alongside production
									ramp, Comfortable operating in a fast-moving, capital-intensive environment
								</li>
								<li className={styles.listItem}>
									Prior experience at ABB, Siemens, GE, Hitachi, Hyundai, Mitsubishi, or major utility labs
								</li>
								<li className={styles.listItem}>
									Familiarity with DOE-funded or federally regulated programs
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
