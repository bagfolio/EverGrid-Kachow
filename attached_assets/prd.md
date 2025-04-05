\*\*Product Requirements Document (PRD)\*\*

\*\*Project Title:\*\* EverGrid

\*\*Author:\*\* \[Team C\]  
\*\*Version:\*\* 1.0  
\*\*Last Updated:\*\* \[Auto-filled upon edits\]

\---

\#\#\# 1\. \*\*Overview\*\*

The \*\*Mobile Lightning Platform\*\* is a full-stack web application designed to help Skilled Nursing Facilities (SNFs) in California prepare for mobile microgrid battery backup installations ahead of the \*\*AB 2511\*\* compliance deadline on \*\*January 1, 2026\*\*. The platform streamlines facility assessment, technical sizing, compliance documentation, financial analysis, and deployment planning.

\---

\#\#\# 2\. \*\*Goals & Objectives\*\*

\- Provide SNFs with a clear, actionable roadmap to achieve AB 2511 compliance  
\- Allow uploading and analysis of real facility data (CSV)  
\- Generate technical and financial recommendations using existing infrastructure info  
\- Deliver intuitive dashboards and progress indicators  
\- Enable internal and external team collaboration  
\- Avoid external databases (localStorage and local JSON only)  
\- Optimize UI for clarity, minimalism, and performance

\---

\#\#\# 3\. \*\*Target Users\*\*

\- SNF administrators and facility managers  
\- Mobile Lightning deployment teams  
\- Energy consultants and implementation partners  
\- Regulatory compliance staff

\---

\#\#\# 4\. \*\*Key Features\*\*

\#\#\#\# 4.1 Global Components  
\- Universal header with greeting, facility info, notification icon  
\- Save & Resume button (uses localStorage)  
\- Role-based settings and breadcrumbs

\#\#\#\# 4.2 Dashboard (Homepage)  
\- Countdown to AB 2511 deadline  
\- Progress tracker across four main stages  
\- Facility snapshot (name, address, status, risk badge)  
\- Risk indicator (uses outage\_likelihood\_score)  
\- ROI teaser with bar chart

\#\#\#\# 4.3 Assessment Module  
\- Upload CSV of SNF data (\`snf\_cleaned.csv\`)  
\- Display and navigate facilities  
\- Load calculator (kW x hours \= kWh)  
\- Facility usage chart (mocked or inferred)

\#\#\#\# 4.4 Compliance Center  
\- Checklist UI based on AB 2511 needs  
\- Status flags for: utility bills, photos, load profiles, site specs  
\- Upload areas or completion toggles per requirement

\#\#\#\# 4.5 Financial Analysis  
\- ROI calculator comparing diesel vs battery  
\- Incentive estimation based on region  
\- 5-year ownership cost breakdown  
\- Adjustable assumptions (fuel costs, outage frequency, etc.)

\#\#\#\# 4.6 Deployment Planner  
\- Gantt-style deployment timeline  
\- Calendar-based scheduling interface  
\- Tasks split by "Facility" vs "Mobile Lightning"  
\- Editable team assignments and stages

\#\#\#\# 4.7 Resource Center  
\- Static FAQs  
\- PDF report generator (summarized assessment)  
\- Image uploader  
\- PRD \+ Replit rules stored in \`/docs\` folder

\#\#\#\# 4.8 Optional: Mapping Module  
\- Leaflet map with facility markers from CSV  
\- Risk overlays: PSPS, wildfire, flood (mocked ok)  
\- Click-to-view facility details

\---

\#\#\# 5\. \*\*Data Requirements\*\*

\*\*Source File:\*\* \`/data/snf\_cleaned.csv\`  
\- 25 fields per row (facility\_id, address, lat/lon, risk flags, etc.)  
\- Parsed via PapaParse or node-csv  
\- Stored as typed JSON and referenced globally

\*\*State Management:\*\*  
\- localStorage for saving/resuming sessions  
\- Session context passed using React Context API

\---

\#\#\# 6\. \*\*User Flows\*\*

1\. \*\*First Visit\*\*  
   \- Land on Dashboard \> Upload facility CSV \> Select facility  
2\. \*\*Assessment\*\*  
   \- View/edit load and battery info \> progress updates  
3\. \*\*Compliance\*\*  
   \- Check off completed items \> upload missing docs  
4\. \*\*Financial\*\*  
   \- Adjust assumptions \> view ROI \> download PDF  
5\. \*\*Deployment\*\*  
   \- Assign timeline and tasks \> save and resume later

\---

\#\#\# 7\. \*\*Constraints & Rules\*\*

\- \*\*No external databases\*\*  
\- Always check for existing file/component names to \*\*avoid duplication\*\*  
\- Do not hardcode facility data (must come from CSV)  
\- Component styling via ShadCN, Tailwind, Radix UI only

\---

\#\#\# 8\. \*\*Success Metrics\*\*

\- Able to process real facility data from CSV  
\- Completion of onboarding through 4 stages  
\- Usability by SNF users with minimal guidance  
\- Fully functional demo running in Replit with \`/docs\` present

\---

\#\#\# 9\. \*\*Appendices\*\*

\*\*A. File Structure\*\*  
\`\`\`  
/data/snf\_cleaned.csv  
/docs/prd.md  
/docs/rules.md  
/app/\* (App Router)  
/components/\*  
\`\`\`

\*\*B. Future Enhancements\*\*  
\- AI assistant integration for site-specific help  
\- Admin portal with heatmaps, clustering, assignment tools  
\- Advanced multi-user role system

