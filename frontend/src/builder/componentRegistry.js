// Component Registry - Defines all available components for the visual builder

export const COMPONENT_TYPES = {
  BUTTON: 'button',
  TEXT: 'text',
  INPUT: 'input',
  CONTAINER: 'container',
  IMAGE: 'image',
  TABLE: 'table',
  FORM: 'form',
  CARD: 'card'
};

export const COMPONENT_DEFINITIONS = [
  {
    type: COMPONENT_TYPES.BUTTON,
    label: 'Button',
    icon: '🔘',
    category: 'Basic',
    defaultProps: {
      text: 'Click me',
      variant: 'primary',
      size: 'medium'
    },
    configurableProps: {
      text: { type: 'string', label: 'Button Text' },
      variant: {
        type: 'select',
        label: 'Style',
        options: ['primary', 'secondary', 'outline']
      },
      size: {
        type: 'select',
        label: 'Size',
        options: ['small', 'medium', 'large']
      },
      onClick: { type: 'action', label: 'Click Action' }
    }
  },
  {
    type: COMPONENT_TYPES.TEXT,
    label: 'Text',
    icon: '📝',
    category: 'Basic',
    defaultProps: {
      content: 'Enter your text here',
      fontSize: 'base',
      fontWeight: 'normal',
      color: 'gray-900'
    },
    configurableProps: {
      content: { type: 'textarea', label: 'Content' },
      fontSize: {
        type: 'select',
        label: 'Font Size',
        options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
      },
      fontWeight: {
        type: 'select',
        label: 'Font Weight',
        options: ['light', 'normal', 'medium', 'semibold', 'bold']
      },
      color: { type: 'color', label: 'Text Color' }
    }
  },
  {
    type: COMPONENT_TYPES.INPUT,
    label: 'Input',
    icon: '📥',
    category: 'Form',
    defaultProps: {
      placeholder: 'Enter text',
      type: 'text',
      label: 'Input Field',
      required: false
    },
    configurableProps: {
      label: { type: 'string', label: 'Label' },
      placeholder: { type: 'string', label: 'Placeholder' },
      type: {
        type: 'select',
        label: 'Input Type',
        options: ['text', 'email', 'password', 'number', 'tel', 'url']
      },
      required: { type: 'boolean', label: 'Required' },
      validation: { type: 'string', label: 'Validation Rule' }
    }
  },
  {
    type: COMPONENT_TYPES.CONTAINER,
    label: 'Container',
    icon: '📦',
    category: 'Layout',
    defaultProps: {
      layout: 'column',
      gap: 'medium',
      padding: 'medium',
      backgroundColor: 'transparent'
    },
    configurableProps: {
      layout: {
        type: 'select',
        label: 'Layout',
        options: ['column', 'row', 'grid']
      },
      gap: {
        type: 'select',
        label: 'Gap',
        options: ['none', 'small', 'medium', 'large']
      },
      padding: {
        type: 'select',
        label: 'Padding',
        options: ['none', 'small', 'medium', 'large']
      },
      backgroundColor: { type: 'color', label: 'Background Color' }
    },
    canContainChildren: true
  },
  {
    type: COMPONENT_TYPES.IMAGE,
    label: 'Image',
    icon: '🖼️',
    category: 'Media',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image',
      width: 'full',
      objectFit: 'cover'
    },
    configurableProps: {
      src: { type: 'string', label: 'Image URL' },
      alt: { type: 'string', label: 'Alt Text' },
      width: {
        type: 'select',
        label: 'Width',
        options: ['auto', 'full', '1/2', '1/3', '1/4']
      },
      objectFit: {
        type: 'select',
        label: 'Object Fit',
        options: ['contain', 'cover', 'fill', 'none']
      }
    }
  },
  {
    type: COMPONENT_TYPES.TABLE,
    label: 'Table',
    icon: '📊',
    category: 'Data',
    defaultProps: {
      columns: ['Column 1', 'Column 2', 'Column 3'],
      dataSource: 'manual',
      striped: true,
      bordered: true
    },
    configurableProps: {
      columns: { type: 'array', label: 'Columns' },
      dataSource: {
        type: 'select',
        label: 'Data Source',
        options: ['manual', 'api', 'database']
      },
      striped: { type: 'boolean', label: 'Striped Rows' },
      bordered: { type: 'boolean', label: 'Show Borders' }
    }
  },
  {
    type: COMPONENT_TYPES.FORM,
    label: 'Form',
    icon: '📋',
    category: 'Form',
    defaultProps: {
      submitLabel: 'Submit',
      resetLabel: 'Reset',
      layout: 'vertical'
    },
    configurableProps: {
      submitLabel: { type: 'string', label: 'Submit Button Text' },
      resetLabel: { type: 'string', label: 'Reset Button Text' },
      layout: {
        type: 'select',
        label: 'Form Layout',
        options: ['vertical', 'horizontal', 'inline']
      },
      onSubmit: { type: 'action', label: 'Submit Action' }
    },
    canContainChildren: true
  },
  {
    type: COMPONENT_TYPES.CARD,
    label: 'Card',
    icon: '🎴',
    category: 'Layout',
    defaultProps: {
      title: 'Card Title',
      showHeader: true,
      showFooter: false,
      elevation: 'medium'
    },
    configurableProps: {
      title: { type: 'string', label: 'Title' },
      showHeader: { type: 'boolean', label: 'Show Header' },
      showFooter: { type: 'boolean', label: 'Show Footer' },
      elevation: {
        type: 'select',
        label: 'Shadow',
        options: ['none', 'small', 'medium', 'large']
      }
    },
    canContainChildren: true
  }
];

// Helper to get component definition by type
export const getComponentDefinition = (type) => {
  return COMPONENT_DEFINITIONS.find(def => def.type === type);
};

// Helper to create new component instance
export const createComponentInstance = (type, customProps = {}) => {
  const definition = getComponentDefinition(type);
  if (!definition) {
    throw new Error(`Unknown component type: ${type}`);
  }

  return {
    id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    props: { ...definition.defaultProps, ...customProps },
    children: definition.canContainChildren ? [] : undefined,
    styles: {
      margin: '0',
      padding: '0'
    }
  };
};

// Group components by category
export const getComponentsByCategory = () => {
  const categories = {};

  COMPONENT_DEFINITIONS.forEach(component => {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  });

  return categories;
};
