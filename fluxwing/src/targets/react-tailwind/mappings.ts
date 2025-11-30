/**
 * React + Tailwind CSS component mappings
 *
 * Maps Fluxwing components to React JSX with Tailwind classes
 */

import type { ComponentMappings } from '../types.js';

export const mappings: ComponentMappings = {
  // ============================================================================
  // Layout Components
  // ============================================================================

  Box: {
    tag: 'div',
    baseClasses: '',
    propsToClasses: {
      padding: { '1': 'p-2', '2': 'p-4', '3': 'p-6' },
      margin: { '1': 'm-2', '2': 'm-4', '3': 'm-6' },
    },
  },

  Stack: {
    tag: 'div',
    baseClasses: 'flex flex-col',
    propsToClasses: {
      gap: { '0': 'gap-0', '1': 'gap-2', '2': 'gap-4', '3': 'gap-6' },
      align: {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
        'stretch': 'items-stretch',
      },
    },
  },

  Row: {
    tag: 'div',
    baseClasses: 'flex flex-row',
    propsToClasses: {
      gap: { '0': 'gap-0', '1': 'gap-2', '2': 'gap-4', '3': 'gap-6' },
      justify: {
        'start': 'justify-start',
        'center': 'justify-center',
        'end': 'justify-end',
        'between': 'justify-between',
        'around': 'justify-around',
      },
      align: {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
      },
    },
  },

  Spacer: {
    tag: 'div',
    baseClasses: 'flex-1',
  },

  Divider: {
    tag: 'hr',
    baseClasses: 'border-t border-gray-200 my-4',
  },

  // ============================================================================
  // Text Components
  // ============================================================================

  Text: {
    tag: 'span',
    baseClasses: 'text-base',
    propsToClasses: {
      bold: { 'true': 'font-bold' },
      italic: { 'true': 'italic' },
      underline: { 'true': 'underline' },
      dimmed: { 'true': 'text-gray-500' },
      dimColor: { 'true': 'text-gray-500' },
      color: {
        'green': 'text-green-600',
        'red': 'text-red-600',
        'blue': 'text-blue-600',
        'yellow': 'text-yellow-600',
        'gray': 'text-gray-500',
      },
    },
  },

  Heading: {
    tag: 'h2',
    baseClasses: 'font-bold',
    propsToClasses: {
      level: {
        '1': 'text-3xl',
        '2': 'text-2xl',
        '3': 'text-xl',
        '4': 'text-lg',
      },
    },
    transform: (props, children) => {
      const level = props.level || '2';
      const tag = `h${level}`;
      const sizeClass = { '1': 'text-3xl', '2': 'text-2xl', '3': 'text-xl', '4': 'text-lg' }[level] || 'text-2xl';
      return `<${tag} className="font-bold ${sizeClass}">${children}</${tag}>`;
    },
  },

  // ============================================================================
  // Interactive Components
  // ============================================================================

  Button: {
    tag: 'button',
    baseClasses: 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantClasses: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    },
    propsToClasses: {
      disabled: { 'true': 'opacity-50 cursor-not-allowed' },
    },
    propsToAttrs: {
      disabled: 'disabled',
    },
  },

  Input: {
    tag: 'input',
    baseClasses: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    wrapperTag: 'div',
    wrapperClasses: 'space-y-1',
    propsToAttrs: {
      placeholder: 'placeholder',
      type: 'type',
      disabled: 'disabled',
    },
    transform: (props, children) => {
      const label = props.label ? `<label className="block text-sm font-medium text-gray-700">${props.label}</label>` : '';
      const type = props.type || 'text';
      const placeholder = props.placeholder ? ` placeholder="${props.placeholder}"` : '';
      const disabled = props.disabled ? ' disabled' : '';
      const inputClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
      return `<div className="space-y-1">${label}<input type="${type}"${placeholder}${disabled} className="${inputClasses}" /></div>`;
    },
  },

  Select: {
    tag: 'select',
    baseClasses: 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    wrapperTag: 'div',
    wrapperClasses: 'space-y-1',
    transform: (props, children) => {
      const label = props.label ? `<label className="block text-sm font-medium text-gray-700">${props.label}</label>` : '';
      const selectClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
      const options = (props.options || []).map((opt: string) => `<option value="${opt}">${opt}</option>`).join('');
      return `<div className="space-y-1">${label}<select className="${selectClasses}">${options}</select></div>`;
    },
  },

  Checkbox: {
    tag: 'input',
    baseClasses: 'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
    transform: (props, children) => {
      const label = props.label || children;
      const checked = props.checked ? ' defaultChecked' : '';
      return `<label className="flex items-center gap-2"><input type="checkbox"${checked} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><span className="text-sm text-gray-700">${label}</span></label>`;
    },
  },

  // ============================================================================
  // Container Components
  // ============================================================================

  Card: {
    tag: 'div',
    baseClasses: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    transform: (props, children) => {
      const title = props.title ? `<div className="px-4 py-3 border-b border-gray-200"><h3 className="text-lg font-medium text-gray-900">${props.title}</h3></div>` : '';
      return `<div className="bg-white border border-gray-200 rounded-lg shadow-sm">${title}<div className="p-4">${children}</div></div>`;
    },
  },

  Panel: {
    tag: 'div',
    baseClasses: 'bg-gray-50 border border-gray-200 rounded-lg p-4',
    transform: (props, children) => {
      const title = props.title ? `<h3 className="text-sm font-medium text-gray-700 mb-2">${props.title}</h3>` : '';
      return `<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">${title}${children}</div>`;
    },
  },

  // ============================================================================
  // Feedback Components
  // ============================================================================

  Alert: {
    tag: 'div',
    baseClasses: 'p-4 rounded-md',
    variantClasses: {
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
      success: 'bg-green-50 text-green-800 border border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
    },
  },

  Badge: {
    tag: 'span',
    baseClasses: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    variantClasses: {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    },
  },

  ProgressBar: {
    tag: 'div',
    baseClasses: 'w-full bg-gray-200 rounded-full h-2',
    transform: (props, children) => {
      const value = props.value || 0;
      const color = props.color || 'blue';
      const colorClass = { blue: 'bg-blue-600', green: 'bg-green-600', red: 'bg-red-600', yellow: 'bg-yellow-600' }[color] || 'bg-blue-600';
      return `<div className="w-full bg-gray-200 rounded-full h-2"><div className="${colorClass} h-2 rounded-full" style={{ width: '${value}%' }}></div></div>`;
    },
  },

  Spinner: {
    tag: 'div',
    baseClasses: 'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
    transform: (props, children) => {
      const size = props.size || 'md';
      const sizeClass = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }[size] || 'h-6 w-6';
      return `<div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClass}"></div>`;
    },
  },

  // ============================================================================
  // Navigation Components
  // ============================================================================

  Link: {
    tag: 'a',
    baseClasses: 'text-blue-600 hover:text-blue-800 hover:underline',
    propsToAttrs: {
      href: 'href',
    },
  },

  Tabs: {
    tag: 'div',
    baseClasses: 'border-b border-gray-200',
    transform: (props, children) => {
      const tabs = (props.tabs || []).map((tab: string, i: number) => {
        const isActive = i === (props.activeIndex || 0);
        const classes = isActive
          ? 'border-b-2 border-blue-500 text-blue-600 px-4 py-2 text-sm font-medium'
          : 'text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium';
        return `<button className="${classes}">${tab}</button>`;
      }).join('');
      return `<div className="border-b border-gray-200"><nav className="flex gap-2">${tabs}</nav></div>`;
    },
  },

  // ============================================================================
  // Table Components
  // ============================================================================

  Table: {
    tag: 'table',
    baseClasses: 'min-w-full divide-y divide-gray-200',
    transform: (props, children) => {
      return `<div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200">${children}</table></div>`;
    },
  },

  TableHeader: {
    tag: 'thead',
    baseClasses: 'bg-gray-50',
  },

  TableBody: {
    tag: 'tbody',
    baseClasses: 'bg-white divide-y divide-gray-200',
  },

  TableRow: {
    tag: 'tr',
    baseClasses: 'hover:bg-gray-50',
  },

  TableCell: {
    tag: 'td',
    baseClasses: 'px-4 py-3 text-sm text-gray-900',
  },

  TableHeaderCell: {
    tag: 'th',
    baseClasses: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
  },
};
