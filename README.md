# Site Revisions CLI

A CLI tool to fetch site revisions information from Wix's internal APIs.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make the script executable (if not already):
```bash
chmod +x index.js
```

## Usage

### Single MSID
```bash
node index.js <msid>
```

### Multiple MSIDs from File
```bash
node index.js <file-path> --file
```

### With Debug Mode
```bash
node index.js <msid> --debug
node index.js <file-path> --file --debug
```

### Generate HTML Report
```bash
node index.js <msid> --report
node index.js <file-path> --file --report
node index.js <file-path> --file --report --debug
```

### Examples

#### Single MSID
```bash
# Fetch configuration for a specific Meta Site ID
node index.js 6759af1c-f457-4632-8b8e-674b50c7f9b8

# Fetch with debug information (shows request headers and responses)
node index.js 6759af1c-f457-4632-8b8e-674b50c7f9b8 --debug
```

#### Multiple MSIDs from File
```bash
# Process multiple MSIDs from a text file
node index.js msids.txt --file

# Process with debug mode
node index.js msids.txt --file --debug
```

### File Format

Create a text file with one MSID per line:

```
# msids.txt
6759af1c-f457-4632-8b8e-674b50c7f9b8
8020e0d-fc42-431e-9599-27c46eaf879a
# This is a comment and will be ignored
another-msid-here
```

- One MSID per line
- Empty lines are ignored
- Lines starting with `#` are treated as comments and ignored
- Whitespace is automatically trimmed

## How it works

The tool performs two main steps:

1. **Authentication**: Fetches an authentication token using the `serverSign` endpoint with the provided Meta Site ID
2. **Site Revisions Retrieval**: Uses the authentication token to fetch site revisions information from the internal API

## Debug Mode

When using the `--debug` flag, the tool will output:
- Complete request URLs
- All request headers
- Request payloads
- Response data
- Response status codes

This is useful for troubleshooting API calls or understanding the data flow.

## Features

- **Single MSID Processing**: Fetch configuration for individual Meta Site IDs
- **Batch Processing**: Process multiple MSIDs from a text file
- **HTML Report Generation**: Create interactive HTML reports with filtering capabilities
- **Progress Tracking**: Shows progress when processing multiple MSIDs
- **Error Handling**: Continues processing even if some MSIDs fail
- **Summary Report**: Provides a summary of successful and failed requests
- **Rate Limiting**: Includes 1-second delay between requests to be respectful to the API
- **Debug Mode**: Detailed logging of requests and responses
- **Comment Support**: Text files can include comments and empty lines
- **Online Ordering Analysis**: Searches for and analyzes online ordering page visibility

## Output

The tool outputs the complete site revisions information as JSON, including:
- Site revision history
- Page configuration details
- Site-specific parameters
- Online ordering page analysis results

## HTML Report

When using the `--report` flag, the tool generates an interactive HTML report with:

### Report Features
- **Summary Statistics**: Total sites, visible pages, hidden pages, not found, and errors
- **Interactive Filtering**: Filter by MSID or page status (Visible/Hidden/Not Found/Error)
- **Responsive Table**: Shows MSID, Site ID, Filename, Page URI SEO, and Page Status
- **Visual Status Badges**: Color-coded status indicators for easy identification
- **Real-time Stats**: Statistics update automatically when filters are applied

### Report Columns
- **MSID**: The Meta Site ID being analyzed
- **Site ID**: The HtmlWeb instance ID used for the site
- **Filename**: The revision filename that was analyzed
- **Page URI SEO**: The SEO-friendly URL of the online ordering page (if found)
- **Page Status**: Visual indicator showing if the page is Visible, Hidden, Not Found, or Error

### Filtering Options
- **MSID Filter**: Search/filter by partial MSID match
- **Page Status Filter**: Show only specific statuses (All/Visible/Hidden/Not Found/Error)
- **Clear Filters**: Reset all filters to show all results

### Batch Processing Output

When processing multiple MSIDs, the tool provides:
- Progress indicators (`[1/5] Processing: msid...`)
- Individual results for each MSID
- Summary report with success/failure counts
- List of failed MSIDs with error messages

## Requirements

- Node.js
- Valid Wix authentication cookies (embedded in the tool)
- Access to Wix internal APIs

## Notes

- The authentication cookies are hardcoded and may expire
- This tool is designed for internal Wix use
- The Meta Site ID must be valid and associated with a Wix site