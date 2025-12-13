import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Resume } from '@/lib/types';

// Register fonts if needed
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 4,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  companyInfo: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  skillsList: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 9,
    color: '#0066cc',
  },
});

interface ResumePDFProps {
  resume: Resume;
  sectionOrder?: string[];
}

export function ResumePDF({ resume, sectionOrder }: ResumePDFProps) {
  const defaultOrder = [
    'personalInfo',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'awards',
    'volunteerExperience',
    'languages',
  ];

  const order = sectionOrder || defaultOrder;

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case 'personalInfo':
        return (
          <View style={styles.header} key="personalInfo">
            <Text style={styles.name}>{resume.personalInfo.name}</Text>
            {resume.personalInfo.email && (
              <Text style={styles.contactInfo}>{resume.personalInfo.email}</Text>
            )}
            {resume.personalInfo.phone && (
              <Text style={styles.contactInfo}>{resume.personalInfo.phone}</Text>
            )}
            {resume.personalInfo.address && (
              <Text style={styles.contactInfo}>{resume.personalInfo.address}</Text>
            )}
            {resume.personalInfo.linkedin && (
              <Text style={styles.contactInfo}>LinkedIn: {resume.personalInfo.linkedin}</Text>
            )}
            {resume.personalInfo.portfolio && (
              <Text style={styles.contactInfo}>Portfolio: {resume.personalInfo.portfolio}</Text>
            )}
          </View>
        );

      case 'summary':
        return resume.summary ? (
          <View style={styles.section} key="summary">
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.sectionContent}>{resume.summary}</Text>
          </View>
        ) : null;

      case 'experience':
        return resume.experience && resume.experience.length > 0 ? (
          <View style={styles.section} key="experience">
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                <Text style={styles.companyInfo}>
                  {exp.company} | {exp.location} | {exp.startDate} - {exp.endDate}
                </Text>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'education':
        return resume.education && resume.education.length > 0 ? (
          <View style={styles.section} key="education">
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{edu.degree}</Text>
                <Text style={styles.companyInfo}>
                  {edu.school} | {edu.location} | Graduated: {edu.graduationDate}
                </Text>
              </View>
            ))}
          </View>
        ) : null;

      case 'skills':
        return resume.skills && resume.skills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsList}>{resume.skills.join(' • ')}</Text>
          </View>
        ) : null;

      case 'projects':
        return resume.projects && resume.projects.length > 0 ? (
          <View style={styles.section} key="projects">
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((proj, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{proj.name}</Text>
                <Text style={styles.description}>{proj.description}</Text>
                {proj.link && <Text style={styles.link}>{proj.link}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case 'certifications':
        return resume.certifications && resume.certifications.length > 0 ? (
          <View style={styles.section} key="certifications">
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications.map((cert, index) => (
              <Text key={index} style={styles.sectionContent}>
                • {cert.name} - {cert.authority} ({cert.date})
              </Text>
            ))}
          </View>
        ) : null;

      case 'awards':
        return resume.awards && resume.awards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={styles.sectionTitle}>Awards</Text>
            {resume.awards.map((award, index) => (
              <Text key={index} style={styles.sectionContent}>
                • {award.name}
              </Text>
            ))}
          </View>
        ) : null;

      case 'volunteerExperience':
        return resume.volunteerExperience && resume.volunteerExperience.length > 0 ? (
          <View style={styles.section} key="volunteerExperience">
            <Text style={styles.sectionTitle}>Volunteer Experience</Text>
            {resume.volunteerExperience.map((vol, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{vol.role}</Text>
                <Text style={styles.companyInfo}>
                  {vol.organization} | {vol.dates}
                </Text>
                {vol.description && (
                  <Text style={styles.description}>{vol.description}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'languages':
        return resume.languages && resume.languages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={styles.sectionTitle}>Languages</Text>
            {resume.languages.map((lang, index) => (
              <Text key={index} style={styles.sectionContent}>
                • {lang.name} ({lang.proficiency})
              </Text>
            ))}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {order.map((sectionType) => renderSection(sectionType))}
      </Page>
    </Document>
  );
}
