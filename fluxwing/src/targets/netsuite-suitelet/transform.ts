/**
 * NetSuite Suitelet transformation utilities
 */

/**
 * Sanitize a string to be a valid JavaScript identifier
 */
export function sanitizeId(id: string): string {
  return id
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^(\d)/, '_$1')
    .toLowerCase();
}

/**
 * Generate the SuiteScript 2.x module wrapper
 */
export function wrapInSuitelet(code: string, name: string): string {
  const functionName = sanitizeId(name);

  return `/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget', 'N/runtime', 'N/log'], function(serverWidget, runtime, log) {

    /**
     * Definition of the Suitelet script trigger point.
     * @param {Object} context
     * @param {ServerRequest} context.request
     * @param {ServerResponse} context.response
     */
    function onRequest(context) {
        if (context.request.method === 'GET') {
            ${functionName}GET(context);
        } else {
            ${functionName}POST(context);
        }
    }

    /**
     * Handles GET requests - renders the form
     */
    function ${functionName}GET(context) {
${code.split('\n').map(line => '        ' + line).join('\n')}

        context.response.writePage(form);
    }

    /**
     * Handles POST requests - processes form submission
     */
    function ${functionName}POST(context) {
        var params = context.request.parameters;

        log.debug('Form Submitted', JSON.stringify(params));

        // TODO: Add form processing logic here

        // Re-render form or redirect
        ${functionName}GET(context);
    }

    return {
        onRequest: onRequest
    };
});`;
}

/**
 * Format the generated code with consistent indentation
 */
export function formatOutput(code: string): string {
  const lines = code.split('\n');
  const formatted: string[] = [];
  let insideObject = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Adjust indent based on braces
    if (trimmed.startsWith('}') || trimmed.startsWith(']);')) {
      insideObject = Math.max(0, insideObject - 1);
    }

    // Add the line with proper indentation
    if (trimmed) {
      formatted.push('    '.repeat(insideObject) + trimmed);
    } else {
      formatted.push('');
    }

    // Adjust for next line
    if (trimmed.endsWith('{') || trimmed.endsWith('({')) {
      insideObject++;
    }
  }

  return formatted.join('\n');
}

/**
 * Generate import statements for a Suitelet
 */
export function generateImports(): string {
  return `/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(serverWidget) {`;
}

/**
 * Escape a string for use in JavaScript
 */
export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Convert a props object to NetSuite field options
 */
export function propsToFieldOptions(props: Record<string, any>): string {
  const options: string[] = [];

  if (props.id) options.push(`id: '${props.id}'`);
  if (props.label) options.push(`label: '${escapeString(props.label)}'`);
  if (props.type) options.push(`type: ${props.type}`);
  if (props.source) options.push(`source: '${props.source}'`);
  if (props.container) options.push(`container: '${props.container}'`);

  return options.join(',\n    ');
}
