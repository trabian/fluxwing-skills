/**
 * NetSuite Suitelet (SuiteScript 2.x) component mappings
 *
 * Maps Fluxwing components to N/ui/serverWidget API calls.
 *
 * NetSuite serverWidget documentation:
 * https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4321345532.html
 */

import type { ComponentMappings } from '../types.js';

/**
 * Field type mappings from Fluxwing to NetSuite FieldType
 */
export const fieldTypes: Record<string, string> = {
  text: 'serverWidget.FieldType.TEXT',
  email: 'serverWidget.FieldType.EMAIL',
  phone: 'serverWidget.FieldType.PHONE',
  password: 'serverWidget.FieldType.PASSWORD',
  number: 'serverWidget.FieldType.INTEGER',
  currency: 'serverWidget.FieldType.CURRENCY',
  date: 'serverWidget.FieldType.DATE',
  datetime: 'serverWidget.FieldType.DATETIMETZ',
  textarea: 'serverWidget.FieldType.TEXTAREA',
  richtext: 'serverWidget.FieldType.RICHTEXT',
  url: 'serverWidget.FieldType.URL',
  percent: 'serverWidget.FieldType.PERCENT',
};

/**
 * Suitelet component mappings
 *
 * Note: NetSuite serverWidget is imperative, not declarative.
 * These mappings generate method calls, not JSX.
 */
export const mappings: ComponentMappings = {
  // ============================================================================
  // Layout Components
  // ============================================================================

  Screen: {
    tag: 'form',
    baseClasses: '',
    transform: (props, children) => {
      const title = props.title || 'Suitelet';
      return `const form = serverWidget.createForm({
    title: '${title}'
});

${children}`;
    },
  },

  Card: {
    tag: 'fieldGroup',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_group_${Date.now()}`;
      const label = props.title || 'Section';
      const collapsible = props.collapsible ? 'true' : 'false';
      const collapsed = props.collapsed ? 'true' : 'false';

      return `// Field Group: ${label}
const ${sanitizeId(id)} = form.addFieldGroup({
    id: '${id}',
    label: '${label}'
});
${collapsible === 'true' ? `${sanitizeId(id)}.isCollapsible = true;` : ''}
${collapsed === 'true' ? `${sanitizeId(id)}.isCollapsed = true;` : ''}

${children}`;
    },
  },

  Panel: {
    tag: 'fieldGroup',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_panel_${Date.now()}`;
      const label = props.title || '';

      return `// Panel: ${label}
form.addFieldGroup({
    id: '${id}',
    label: '${label}'
});

${children}`;
    },
  },

  Stack: {
    tag: 'container',
    baseClasses: '',
    // NetSuite forms are inherently vertical stacks
    transform: (props, children) => children,
  },

  Row: {
    tag: 'container',
    baseClasses: '',
    transform: (props, children) => {
      // NetSuite uses layoutType for horizontal layouts
      return `// Horizontal layout - set field layout
${children}`;
    },
  },

  Divider: {
    tag: 'field',
    baseClasses: '',
    transform: () => {
      const id = `custpage_divider_${Date.now()}`;
      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<hr style="margin: 10px 0; border-top: 1px solid #ccc;" />';`;
    },
  },

  Spacer: {
    tag: 'field',
    baseClasses: '',
    transform: () => {
      const id = `custpage_spacer_${Date.now()}`;
      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<div style="height: 20px;"></div>';`;
    },
  },

  // ============================================================================
  // Text Components
  // ============================================================================

  Text: {
    tag: 'inlinehtml',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_text_${Date.now()}`;
      const bold = props.bold ? 'font-weight: bold;' : '';
      const dimmed = props.dimmed ? 'color: #666;' : '';
      const color = props.color ? `color: ${props.color};` : '';
      const style = [bold, dimmed, color].filter(Boolean).join(' ');

      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<span style="${style}">${children}</span>';`;
    },
  },

  Heading: {
    tag: 'inlinehtml',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_heading_${Date.now()}`;
      const level = props.level || 2;
      const sizes: Record<string, string> = {
        '1': '24px',
        '2': '20px',
        '3': '16px',
        '4': '14px',
      };
      const size = sizes[String(level)] || '20px';

      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<h${level} style="font-size: ${size}; font-weight: bold; margin: 10px 0;">${children}</h${level}>';`;
    },
  },

  Label: {
    tag: 'label',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_label_${Date.now()}`;
      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.LABEL,
    label: '${children}'
});`;
    },
  },

  // ============================================================================
  // Interactive Components
  // ============================================================================

  Button: {
    tag: 'button',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_btn_${Date.now()}`;
      const label = children || props.label || 'Button';
      const functionName = props.onClick || props.function || '';

      if (props.submit || props.variant === 'primary') {
        return `form.addSubmitButton({
    label: '${label}'
});`;
      }

      if (props.reset) {
        return `form.addResetButton({
    label: '${label}'
});`;
      }

      return `form.addButton({
    id: '${id}',
    label: '${label}'${functionName ? `,
    functionName: '${functionName}'` : ''}
});`;
    },
  },

  Input: {
    tag: 'field',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_${sanitizeId(props.label || 'field')}_${Date.now()}`;
      const varName = sanitizeId(id);
      const label = props.label || 'Field';
      const type = props.type || 'text';
      const fieldType = fieldTypes[type] || 'serverWidget.FieldType.TEXT';
      const mandatory = props.required ? `\n${varName}.isMandatory = true;` : '';
      const help = props.help ? `\n${varName}.setHelpText({ help: '${props.help}' });` : '';
      const defaultValue = props.defaultValue ? `\n${varName}.defaultValue = '${props.defaultValue}';` : '';
      const container = props.container ? `,
    container: '${props.container}'` : '';

      return `const ${varName} = form.addField({
    id: '${id}',
    type: ${fieldType},
    label: '${label}'${container}
});${mandatory}${help}${defaultValue}`;
    },
  },

  TextArea: {
    tag: 'field',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_textarea_${Date.now()}`;
      const label = props.label || 'Text Area';
      const displayType = props.readonly ?
        '\nfield.updateDisplayType({ displayType: serverWidget.FieldDisplayType.READONLY });' : '';

      return `const ${sanitizeId(id)} = form.addField({
    id: '${id}',
    type: serverWidget.FieldType.TEXTAREA,
    label: '${label}'
});${displayType}`;
    },
  },

  Select: {
    tag: 'field',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_select_${Date.now()}`;
      const label = props.label || 'Select';
      const options = props.options || [];
      const source = props.source; // NetSuite record type for dynamic options

      let code = `const ${sanitizeId(id)} = form.addField({
    id: '${id}',
    type: serverWidget.FieldType.SELECT,
    label: '${label}'${source ? `,
    source: '${source}'` : ''}
});`;

      if (!source && options.length > 0) {
        code += `\n${sanitizeId(id)}.addSelectOption({ value: '', text: '' });`;
        for (const opt of options) {
          const value = typeof opt === 'object' ? opt.value : opt;
          const text = typeof opt === 'object' ? opt.text : opt;
          code += `\n${sanitizeId(id)}.addSelectOption({ value: '${value}', text: '${text}' });`;
        }
      }

      return code;
    },
  },

  Checkbox: {
    tag: 'field',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_checkbox_${Date.now()}`;
      const label = props.label || children || 'Checkbox';
      const checked = props.checked ? `\n${sanitizeId(id)}.defaultValue = 'T';` : '';

      return `const ${sanitizeId(id)} = form.addField({
    id: '${id}',
    type: serverWidget.FieldType.CHECKBOX,
    label: '${label}'
});${checked}`;
    },
  },

  Radio: {
    tag: 'field',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_radio_${Date.now()}`;
      const label = props.label || children || 'Radio';
      // NetSuite doesn't have native radio - use SELECT or custom HTML
      return `// Note: NetSuite uses SELECT for radio-like behavior
const ${sanitizeId(id)} = form.addField({
    id: '${id}',
    type: serverWidget.FieldType.SELECT,
    label: '${label}'
});`;
    },
  },

  // ============================================================================
  // Feedback Components
  // ============================================================================

  Alert: {
    tag: 'inlinehtml',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_alert_${Date.now()}`;
      const variant = props.variant || 'info';
      const colors: Record<string, { bg: string; border: string; text: string }> = {
        info: { bg: '#e7f3ff', border: '#0070d2', text: '#0070d2' },
        success: { bg: '#e6f9e6', border: '#2e844a', text: '#2e844a' },
        warning: { bg: '#fff8e6', border: '#ff9800', text: '#996600' },
        error: { bg: '#fee6e6', border: '#c23934', text: '#c23934' },
      };
      const color = colors[variant] || colors.info;

      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<div style="padding: 10px; background: ${color.bg}; border-left: 4px solid ${color.border}; color: ${color.text}; margin: 10px 0;">${children}</div>';`;
    },
  },

  Badge: {
    tag: 'inlinehtml',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_badge_${Date.now()}`;
      const variant = props.variant || 'default';
      const colors: Record<string, { bg: string; text: string }> = {
        default: { bg: '#e0e0e0', text: '#333' },
        primary: { bg: '#0070d2', text: '#fff' },
        success: { bg: '#2e844a', text: '#fff' },
        warning: { bg: '#ff9800', text: '#fff' },
        danger: { bg: '#c23934', text: '#fff' },
      };
      const color = colors[variant] || colors.default;

      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<span style="display: inline-block; padding: 2px 8px; background: ${color.bg}; color: ${color.text}; border-radius: 12px; font-size: 12px;">${children}</span>';`;
    },
  },

  Progress: {
    tag: 'inlinehtml',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_progress_${Date.now()}`;
      const value = props.value || 0;
      const color = props.color || '#0070d2';

      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<div style="background: #e0e0e0; border-radius: 4px; height: 8px; width: 100%;"><div style="background: ${color}; height: 100%; border-radius: 4px; width: ${value}%;"></div></div>';`;
    },
  },

  // ============================================================================
  // Table Components (Sublists)
  // ============================================================================

  Table: {
    tag: 'sublist',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_list_${Date.now()}`;
      const label = props.title || props.label || 'Items';
      const type = props.editable ? 'serverWidget.SublistType.INLINEEDITOR' : 'serverWidget.SublistType.LIST';

      return `const ${sanitizeId(id)} = form.addSublist({
    id: '${id}',
    type: ${type},
    label: '${label}'
});

${children}`;
    },
  },

  TableHeaderCell: {
    tag: 'column',
    baseClasses: '',
    transform: (props, children) => {
      const sublistId = props.sublistId || 'custpage_list';
      const id = props.id || `custpage_col_${Date.now()}`;
      const label = children || props.label || 'Column';
      const type = props.type || 'text';
      const fieldType = fieldTypes[type] || 'serverWidget.FieldType.TEXT';

      return `${sanitizeId(sublistId)}.addField({
    id: '${id}',
    type: ${fieldType},
    label: '${label}'
});`;
    },
  },

  // ============================================================================
  // Navigation Components
  // ============================================================================

  Link: {
    tag: 'inlinehtml',
    baseClasses: '',
    transform: (props, children) => {
      const id = props.id || `custpage_link_${Date.now()}`;
      const href = props.href || '#';

      return `form.addField({
    id: '${id}',
    type: serverWidget.FieldType.INLINEHTML,
    label: ' '
}).defaultValue = '<a href="${href}" style="color: #0070d2; text-decoration: none;">${children}</a>';`;
    },
  },

  Tabs: {
    tag: 'tabs',
    baseClasses: '',
    transform: (props, children) => {
      const tabs = props.tabs || [];
      let code = '// NetSuite Tab Structure\n';

      for (let i = 0; i < tabs.length; i++) {
        const tabId = `custpage_tab_${i}`;
        const tabLabel = tabs[i];
        code += `form.addTab({
    id: '${tabId}',
    label: '${tabLabel}'
});\n`;
      }

      return code + '\n' + children;
    },
  },
};

/**
 * Sanitize a string to be a valid JavaScript identifier
 */
function sanitizeId(id: string): string {
  return id
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^(\d)/, '_$1')
    .toLowerCase();
}
