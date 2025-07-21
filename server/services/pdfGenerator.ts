import puppeteer from 'puppeteer';
import type { ResumeData } from '@shared/schema';

export async function generateResumePDF(title: string, data: ResumeData): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    
    // Generate HTML content for the resume
    const html = generateResumeHTML(data);
    
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
        right: '0.5in',
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

function generateResumeHTML(data: ResumeData): string {
  const { personalInfo, experience, education, skills, projects } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          line-height: 1.5;
          color: #333;
          background: white;
        }
        
        .resume {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.5in;
          background: white;
        }
        
        .header {
          border-bottom: 2px solid #2563eb;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .name {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .contact {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .contact span {
          margin-right: 1.5rem;
        }
        
        .section {
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.75rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .summary {
          color: #374151;
          text-align: justify;
        }
        
        .item {
          margin-bottom: 1rem;
        }
        
        .item:last-child {
          margin-bottom: 0;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }
        
        .item-title {
          font-weight: bold;
          color: #1f2937;
        }
        
        .item-subtitle {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .item-date {
          color: #6b7280;
          font-size: 0.85rem;
          white-space: nowrap;
        }
        
        .item-description {
          color: #374151;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
        
        .item-description ul {
          margin-left: 1rem;
        }
        
        .item-description li {
          margin-bottom: 0.25rem;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .skill-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          border: 1px solid #dbeafe;
        }
        
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }
        
        .project-url {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.85rem;
        }
        
        .project-tech {
          color: #6b7280;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }
        
        @media print {
          body { margin: 0; }
          .resume { margin: 0; padding: 0.5in; }
        }
      </style>
    </head>
    <body>
      <div class="resume">
        <!-- Header -->
        <div class="header">
          <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
          <div class="contact">
            ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
          </div>
        </div>

        ${personalInfo.summary ? `
        <!-- Summary -->
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary">${personalInfo.summary}</div>
        </div>
        ` : ''}

        ${experience.length > 0 ? `
        <!-- Experience -->
        <div class="section">
          <div class="section-title">Experience</div>
          ${experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.title}</div>
                  <div class="item-subtitle">${exp.company}</div>
                </div>
                <div class="item-date">${exp.startDate} - ${exp.endDate}</div>
              </div>
              ${exp.description ? `
                <div class="item-description">
                  ${formatDescription(exp.description)}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${education.length > 0 ? `
        <!-- Education -->
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree}</div>
                  <div class="item-subtitle">${edu.school}</div>
                </div>
                <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
              </div>
              ${edu.description ? `
                <div class="item-description">${edu.description}</div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${skills.length > 0 ? `
        <!-- Skills -->
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-container">
            ${skills.map(skill => `
              <span class="skill-tag">
                ${skill.name}${skill.level ? ` (${skill.level})` : ''}
              </span>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${projects.length > 0 ? `
        <!-- Projects -->
        <div class="section">
          <div class="section-title">Projects</div>
          ${projects.map(project => `
            <div class="item">
              <div class="project-header">
                <div class="item-title">${project.name}</div>
                ${project.url ? `<a href="${project.url}" class="project-url">View Project</a>` : ''}
              </div>
              <div class="item-description">${project.description}</div>
              <div class="project-tech"><strong>Technologies:</strong> ${project.technologies}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

function formatDescription(description: string): string {
  const lines = description.split('\n').filter(line => line.trim());
  
  if (lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'))) {
    // Convert to HTML list
    const listItems = lines.map(line => {
      const cleaned = line.replace(/^[•-]\s*/, '').trim();
      return `<li>${cleaned}</li>`;
    }).join('');
    return `<ul>${listItems}</ul>`;
  } else {
    // Regular paragraphs
    return lines.map(line => `<p>${line.trim()}</p>`).join('');
  }
}
