import { config, fields, singleton } from '@keystatic/core'

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'MFRH CV',
    },
  },
  singletons: {
    cv: singleton({
      label: 'CV',
      path: 'content/cv/',
      format: { data: 'json' },
      schema: {
        // ── Header ──────────────────────────────────────────
        name: fields.text({ label: 'Full Name' }),
        title: fields.text({ label: 'Professional Title (subtitle)' }),
        email: fields.text({ label: 'Email' }),
        phone: fields.text({ label: 'Phone' }),
        linkedin: fields.text({ label: 'LinkedIn (e.g. linkedin.com/in/mfrh)' }),
        profileImage: fields.image({
          label: 'Profile Photo',
          directory: 'public/images/profile',
          publicPath: '/images/profile',
        }),

        // ── About ───────────────────────────────────────────
        summary: fields.text({
          label: 'About Me (Über Mich)',
          multiline: true,
        }),

        // ── Work Experience ─────────────────────────────────
        experience: fields.array(
          fields.object({
            duration: fields.text({ label: 'Duration (e.g. 1.5 Jahre)' }),
            startDate: fields.text({ label: 'Start Date (e.g. Juni 2024)' }),
            endDate: fields.text({ label: 'End Date (e.g. heute)' }),
            company: fields.text({ label: 'Company' }),
            role: fields.text({ label: 'Job Title / Role' }),
            description: fields.text({
              label: 'Responsibilities (one bullet point per line)',
              multiline: true,
            }),
          }),
          {
            label: 'Work Experience (Berufserfahrung)',
            itemLabel: (props) =>
              `${props.fields.role.value || 'Role'} @ ${props.fields.company.value || 'Company'}`,
          },
        ),

        // ── Skills with dot rating ──────────────────────────
        skillMaxDots: fields.integer({
          label: 'Max Dots per Skill',
          defaultValue: 5,
          validation: { min: 1, max: 10 },
          description: 'Maximum number of dots shown for each skill rating',
        }),
        skills: fields.array(
          fields.object({
            name: fields.text({ label: 'Skill Name' }),
            level: fields.integer({
              label: 'Level',
              defaultValue: 4,
              validation: { min: 1, max: 10 },
              description: 'Number of filled dots',
            }),
          }),
          {
            label: 'Tech & Software (mit Dot-Rating)',
            itemLabel: (props) => props.fields.name.value || 'Tool',
          },
        ),

        // ── Languages ───────────────────────────────────────
        languages: fields.array(
          fields.object({
            name: fields.text({ label: 'Language' }),
            level: fields.text({ label: 'Level (e.g. Muttersprache, C1)' }),
          }),
          {
            label: 'Languages (Sprachen)',
            itemLabel: (props) => props.fields.name.value || 'Language',
          },
        ),

        // ── Education ───────────────────────────────────────
        education: fields.array(
          fields.object({
            institution: fields.text({ label: 'Institution' }),
            degree: fields.text({ label: 'Degree / Program' }),
            startDate: fields.text({ label: 'Start Date' }),
            endDate: fields.text({ label: 'End Date' }),
          }),
          {
            label: 'Education (Ausbildung)',
            itemLabel: (props) => props.fields.degree.value || 'Entry',
          },
        ),

        // ── Certificates ────────────────────────────────────
        certificates: fields.array(
          fields.object({
            name: fields.text({ label: 'Certificate Name' }),
            issuer: fields.text({ label: 'Issuer' }),
            date: fields.text({ label: 'Date' }),
            status: fields.text({ label: 'Status (e.g. in progress)' }),
          }),
          {
            label: 'Certificates (Zertifikate)',
            itemLabel: (props) => props.fields.name.value || 'Certificate',
          },
        ),
      },
    }),

    coverLetter: singleton({
      label: 'Cover Letter (Anschreiben)',
      path: 'content/cover-letter/',
      format: { data: 'json' },
      schema: {
        recipientSalutation: fields.text({
          label: 'Salutation (e.g. Sehr geehrtes ... Team)',
        }),
        body: fields.text({
          label: 'Letter Body',
          multiline: true,
        }),
        closing: fields.text({
          label: 'Closing (e.g. Mit freundlichen Grüßen)',
        }),
        senderName: fields.text({ label: 'Sender Name' }),
      },
    }),
  },
})
