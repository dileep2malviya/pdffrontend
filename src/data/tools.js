export const toolGroups = [
  {
    title: 'Convert PDF',
    subtitle: 'Transform files into and from PDF quickly.',
    tools: [
      {
        slug: 'jpg-to-pdf',
        name: 'JPG to PDF',
        description: 'Combine images into one polished PDF with layout controls.',
        accent: '#ff8a00'
      },
      {
        slug: 'word-to-pdf',
        name: 'Word to PDF',
        description: 'Convert DOC and DOCX documents into secure PDFs.',
        accent: '#4f8cff'
      },
      {
        slug: 'ppt-to-pdf',
        name: 'PowerPoint to PDF',
        description: 'Export presentations into shareable print-ready PDFs.',
        accent: '#ff5f45'
      },
      {
        slug: 'excel-to-pdf',
        name: 'Excel to PDF',
        description: 'Turn spreadsheets into clean PDF reports instantly.',
        accent: '#00a86b'
      },
      {
        slug: 'pdf-to-jpg',
        name: 'PDF to JPG',
        description: 'Extract pages as high-quality image files.',
        accent: '#f44336'
      }
    ]
  },
  {
    title: 'Organize PDF',
    subtitle: 'Structure and tune your PDF documents for any workflow.',
    tools: [
      {
        slug: 'merge-pdf',
        name: 'Merge PDF',
        description: 'Join multiple PDFs in the order you choose.',
        accent: '#8e24aa'
      },
      {
        slug: 'split-pdf',
        name: 'Split PDF',
        description: 'Extract pages or divide one file into several PDFs.',
        accent: '#3949ab'
      },
      // {
      //   slug: 'compress-pdf',
      //   name: 'Compress PDF',
      //   description: 'Reduce PDF size while preserving quality balance.',
      //   accent: '#00897b'
      // },
      {
        slug: 'rotate-pdf',
        name: 'Rotate PDF',
        description: 'Rotate pages and fix reading orientation in seconds.',
        accent: '#fbc02d'
      },
      {
        slug: 'unlock-pdf',
        name: 'Unlock PDF',
        description: 'Remove restrictions from your own protected documents.',
        accent: '#d81b60'
      },
      {
        slug: 'protect-pdf',
        name: 'Protect PDF',
        description: 'Encrypt PDFs with passwords and permission controls.',
        accent: '#1e88e5'
      }
    ]
  },
  {
    title: 'Edit PDF',
    subtitle: 'Add content, signatures, page numbers, and watermarks.',
    tools: [
      {
        slug: 'edit-pdf',
        name: 'Edit PDF',
        description: 'Add text, shapes, highlights, and notes on PDF pages.',
        accent: '#ef5350'
      },
      {
        slug: 'watermark-pdf',
        name: 'Watermark PDF',
        description: 'Brand PDFs with text or image watermarks.',
        accent: '#5c6bc0'
      },
      {
        slug: 'page-numbers',
        name: 'Add Page Numbers',
        description: 'Auto-number pages with custom style and placement.',
        accent: '#26a69a'
      },
      {
        slug: 'sign-pdf',
        name: 'Sign PDF',
        description: 'Apply digital signatures and approval fields.',
        accent: '#fb8c00'
      }
    ]
  }
];

export const allTools = toolGroups.flatMap((group) =>
  group.tools.map((tool) => ({ ...tool, group: group.title }))
);

export const stats = [
  { label: 'Tool Coverage', value: 'Conversion + Editing' },
  { label: 'Workflow', value: 'Upload to Download' },
  { label: 'Access', value: 'Browser Based' },
  { label: 'Account Requirement', value: 'No Signup for Basic Use' }
];

export const trustPoints = [
  'Batch processing for multiple files',
  'Smart previews before final export',
  'Cloud-ready architecture for scale',
  'Zero copy workflow with reusable modules'
];
