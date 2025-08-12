import type { Resume } from './types';

export function getResumeAsText(resumeData: Resume): string {
  let resumeText = '';

  // Personal Info
  resumeText += `Name: ${resumeData.personalInfo.name}\n`;
  resumeText += `Email: ${resumeData.personalInfo.email}\n`;
  resumeText += `Phone: ${resumeData.personalInfo.phone}\n`;
  resumeText += `Address: ${resumeData.personalInfo.address}\n`;
  resumeText += `LinkedIn: ${resumeData.personalInfo.linkedin}\n`;
  resumeText += `Portfolio: ${resumeData.personalInfo.portfolio}\n\n`;

  // Summary
  if (resumeData.summary) {
    resumeText += `Summary:\n${resumeData.summary}\n\n`;
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    resumeText += `Experience:\n`;
    resumeData.experience.forEach(exp => {
      resumeText += `- ${exp.jobTitle} at ${exp.company}, ${exp.location} (${exp.startDate} - ${exp.endDate})\n`;
      resumeText += `  Description: ${exp.description}\n`;
    });
    resumeText += `\n`;
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    resumeText += `Education:\n`;
    resumeData.education.forEach(edu => {
      resumeText += `- ${edu.degree} from ${edu.school}, ${edu.location} (Graduated: ${edu.graduationDate})\n`;
    });
    resumeText += `\n`;
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    resumeText += `Projects:\n`;
    resumeData.projects.forEach(proj => {
      resumeText += `- Project: ${proj.name}\n`;
      resumeText += `  Description: ${proj.description}\n`;
      if (proj.link) resumeText += `  Link: ${proj.link}\n`;
    });
    resumeText += `\n`;
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    resumeText += `Skills: ${resumeData.skills.join(', ')}\n\n`;
  }

  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    resumeText += `Certifications:\n`;
    resumeData.certifications.forEach(cert => {
      resumeText += `- ${cert.name} - ${cert.authority} (${cert.date})\n`;
    });
    resumeText += `\n`;
  }

  // Awards
  if (resumeData.awards && resumeData.awards.length > 0) {
    resumeText += `Awards:\n`;
    resumeData.awards.forEach(award => {
      resumeText += `- ${award.name}\n`;
    });
    resumeText += `\n`;
  }

  // Volunteer Experience
  if (resumeData.volunteerExperience && resumeData.volunteerExperience.length > 0) {
    resumeText += `Volunteer Experience:\n`;
    resumeData.volunteerExperience.forEach(vol => {
      resumeText += `- ${vol.role} at ${vol.organization} (${vol.dates})\n`;
      resumeText += `  Description: ${vol.description}\n`;
    });
    resumeText += `\n`;
  }

  // Languages
  if (resumeData.languages && resumeData.languages.length > 0) {
    resumeText += `Languages:\n`;
    resumeData.languages.forEach(lang => {
      resumeText += `- ${lang.name} (${lang.proficiency})\n`;
    });
    resumeText += `\n`;
  }

  return resumeText.trim();
}
