'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/resume-pdf';
import type { Resume } from '@/lib/types';

interface ResumeDownloadButtonProps {
  resumeData: Resume;
  sectionOrder?: string[];
}

export function ResumeDownloadButton({ resumeData, sectionOrder }: ResumeDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<ResumePDF resume={resumeData} sectionOrder={sectionOrder} />}
      fileName={`${resumeData.personalInfo.name?.replace(/\s+/g, '_') || 'resume'}.pdf`}
      className="inline-block"
    >
      {({ loading }) => (
        <Button disabled={loading} className="gap-2">
          <Download className="h-4 w-4" />
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
