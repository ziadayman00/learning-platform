// app/courses/[slug]/certificate/CertificateClient.tsx
"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

type CertificateData = {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: Date;
  certificateId: string;
};

type CertificateClientProps = {
  certificate: CertificateData;
  courseSlug: string;
};

export default function CertificateClient({ certificate, courseSlug }: CertificateClientProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setIsDownloading(true);
    const toastId = toast.loading('Generating your certificate...');

    try {
      const element = certificateRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdfWidth = 297;
      const pdfHeight = 210;
      
      const canvasRatio = imgWidth / imgHeight;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = pdfHeight;
      let xOffset = 0;
      let yOffset = 0;
      
      const padding = 5;
      finalWidth = pdfWidth - (padding * 2);
      finalHeight = pdfHeight - (padding * 2);
      
      if (canvasRatio > pdfRatio) {
        finalHeight = finalWidth / canvasRatio;
        yOffset = (pdfHeight - finalHeight) / 2;
        xOffset = padding;
      } else {
        finalWidth = finalHeight * canvasRatio;
        xOffset = (pdfWidth - finalWidth) / 2;
        yOffset = padding;
      }

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
      
      const filename = `${certificate.courseName.replace(/[^a-z0-9]/gi, '-')}-Certificate.pdf`;
      pdf.save(filename);

      toast.dismiss(toastId);
      toast.success('Certificate downloaded! 🎉');
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss(toastId);
      toast.error('Failed to download certificate. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.courseName} - Certificate of Completion`,
          text: `I just completed ${certificate.courseName} on Skillify!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href={`/courses/${courseSlug}/learn`}
            className="flex items-center gap-2 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back to Course</span>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="rounded-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="rounded-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </header>

      {/* Certificate Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            Congratulations! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            You've successfully completed this course
          </p>
        </div>

        {/* Certificate - Bold Black & White Design */}
        <div className="flex justify-center">
          <div 
            ref={certificateRef}
            style={{ 
              width: '1300px',
              height: '900px',
              backgroundColor: '#ffffff',
              padding: '50px',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.3)',
              fontFamily: 'inherit',
            }}
          >
            {/* Bold outer border */}
            <div style={{
              width: '100%',
              height: '100%',
              border: '12px solid #000000',
              padding: '50px 70px',
              position: 'relative',
            }}>
              {/* Inner decorative border */}
              <div style={{
                position: 'absolute',
                inset: '40px',
                border: '3px solid #000000',
                pointerEvents: 'none',
              }}>
                {/* Bold corner accents */}
                <div style={{ position: 'absolute', top: '-3px', left: '-3px', width: '60px', height: '60px', borderTop: '8px solid #000000', borderLeft: '8px solid #000000' }}></div>
                <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '60px', height: '60px', borderTop: '8px solid #000000', borderRight: '8px solid #000000' }}></div>
                <div style={{ position: 'absolute', bottom: '-3px', left: '-3px', width: '60px', height: '60px', borderBottom: '8px solid #000000', borderLeft: '8px solid #000000' }}></div>
                <div style={{ position: 'absolute', bottom: '-3px', right: '-3px', width: '60px', height: '60px', borderBottom: '8px solid #000000', borderRight: '8px solid #000000' }}></div>
              </div>

              {/* Content wrapper */}
              <div style={{ 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1,
              }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ 
                    fontSize: '72px', 
                    fontWeight: 900, 
                    letterSpacing: '0.1em', 
                    margin: 0,
                    marginBottom: '12px',
                    color: '#000000',
                    fontFamily: 'inherit',
                  }}>
                    SKILLIFY
                  </h2>
                  <div style={{ 
                    width: '180px', 
                    height: '6px', 
                    backgroundColor: '#000000',
                    margin: '0 auto 20px auto',
                  }}></div>
                  <p style={{ 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    letterSpacing: '0.25em', 
                    color: '#000000',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}>
                    Certificate of Completion
                  </p>
                </div>

                {/* Main Content */}
                <div style={{ 
                  textAlign: 'center', 
                  padding: '30px 60px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#000000', 
                    marginBottom: '24px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}>
                    This certifies that
                  </p>
                  
                  <div style={{
                    borderBottom: '4px solid #000000',
                    paddingBottom: '16px',
                    marginBottom: '24px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <h3 style={{ 
                      fontSize: '52px', 
                      fontWeight: 900, 
                      color: '#000000',
                      margin: 0,
                      lineHeight: 1.2,
                      fontFamily: 'inherit',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%',
                    }}>
                      {certificate.studentName}
                    </h3>
                  </div>

                  <p style={{ 
                    fontSize: '16px', 
                    color: '#000000', 
                    marginBottom: '24px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}>
                    has successfully completed the course
                  </p>

                  <div style={{
                    borderBottom: '4px solid #000000',
                    paddingBottom: '14px',
                    marginBottom: '24px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <h4 style={{ 
                      fontSize: '36px', 
                      fontWeight: 800, 
                      color: '#000000',
                      margin: 0,
                      lineHeight: 1.3,
                      fontFamily: 'inherit',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%',
                    }}>
                      {certificate.courseName}
                    </h4>
                  </div>

                  <div style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '10px 28px',
                    display: 'inline-block',
                    margin: '0 auto',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      margin: 0,
                    }}>
                      {formatDate(certificate.completionDate)}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-end',
                  paddingTop: '20px',
                  borderTop: '3px solid #000000',
                }}>
                  {/* Instructor signature */}
                  <div style={{ textAlign: 'left', minWidth: '200px' }}>
                    <p style={{ 
                      fontWeight: 900, 
                      fontSize: '18px', 
                      color: '#000000',
                      margin: '0 0 4px 0',
                      fontFamily: 'inherit',
                    }}>
                      {certificate.instructorName}
                    </p>
                      <div style={{ 
                        width: '200px', 
                        height: '3px',
                        backgroundColor: '#000000',
                        marginBottom: '8px',
                      }}></div>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#000000', 
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                    }}>
                      Course Instructor
                    </p>
                  </div>

                  {/* Certificate ID */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      fontSize: '11px', 
                      color: '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '6px',
                      fontWeight: 700,
                    }}>
                      Certificate ID
                    </p>
                    <p style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '13px', 
                      fontWeight: 900,
                      color: '#000000',
                      margin: 0,
                      letterSpacing: '0.05em',
                    }}>
                      {certificate.certificateId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-4">About This Certificate</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • This certificate verifies that <strong>{certificate.studentName}</strong> has 
              completed all required coursework for <strong>{certificate.courseName}</strong>.
            </p>
            <p>
              • Certificate ID: <strong className="font-mono break-all">{certificate.certificateId}</strong>
            </p>
            <p>
              • You can download this certificate as a PDF and share it on LinkedIn, 
              your resume, or anywhere else you'd like to showcase your achievement.
            </p>
            <p>
              • This certificate does not expire and is valid indefinitely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}