import { useBuilderStore } from '../store/builderStore'
import { getComponentDefinition } from './componentRegistry'

export default function PropertiesPanel() {
  const {
    selectedComponentId,
    getSelectedComponent,
    updateComponentProps,
    removeComponent
  } = useBuilderStore()

  const selectedComponent = getSelectedComponent()

  if (!selectedComponent) {
    return (
      <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Properties</h3>
        <p className="text-sm text-gray-500">Select a component to edit its properties</p>
      </div>
    )
  }

  const definition = getComponentDefinition(selectedComponent.type)

  if (!definition) {
    return (
      <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Properties</h3>
        <p className="text-sm text-red-500">Unknown component type</p>
      </div>
    )
  }

  const handlePropChange = (propName, value) => {
    updateComponentProps(selectedComponent.id, { [propName]: value })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this component?')) {
      removeComponent(selectedComponent.id)
    }
  }

  const renderPropInput = (propName, propConfig) => {
    const currentValue = selectedComponent.props[propName]

    switch (propConfig.type) {
      case 'string':
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            className="input text-sm"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={currentValue || ''}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            className="input text-sm"
            rows={3}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={currentValue || 0}
            onChange={(e) => handlePropChange(propName, parseFloat(e.target.value))}
            className="input text-sm"
          />
        )

      case 'boolean':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue || false}
              onChange={(e) => handlePropChange(propName, e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">{currentValue ? 'Yes' : 'No'}</span>
          </label>
        )

      case 'select':
        return (
          <select
            value={currentValue || propConfig.options[0]}
            onChange={(e) => handlePropChange(propName, e.target.value)}
            className="input text-sm"
          >
            {propConfig.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'color':
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={currentValue || '#000000'}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              className="w-12 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={currentValue || '#000000'}
              onChange={(e) => handlePropChange(propName, e.target.value)}
              className="input text-sm flex-1"
            />
          </div>
        )

      case 'array':
        return (
          <textarea
            value={Array.isArray(currentValue) ? currentValue.join(', ') : ''}
            onChange={(e) => handlePropChange(propName, e.target.value.split(',').map(s => s.trim()))}
            className="input text-sm"
            rows={2}
            placeholder="Comma-separated values"
          />
        )

      case 'action':
        return (
          <div className="text-sm text-gray-500 italic">
            Action configuration coming soon
          </div>
        )

      default:
        return (
          <div className="text-sm text-gray-500">
            Unsupported type: {propConfig.type}
          </div>
        )
    }
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Properties</h3>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Delete component"
          >
            🗑️ Delete
          </button>
        </div>

        {/* Component Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{definition.icon}</span>
            <span className="font-medium">{definition.label}</span>
          </div>
          <div className="text-xs text-gray-500">
            {definition.category}
          </div>
        </div>

        {/* Component Properties */}
        <div className="space-y-4">
          {Object.entries(definition.configurableProps || {}).map(([propName, propConfig]) => (
            <div key={propName}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {propConfig.label}
              </label>
              {renderPropInput(propName, propConfig)}
            </div>
          ))}
        </div>

        {/* Advanced Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-sm mb-3">Advanced</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component ID
              </label>
              <input
                type="text"
                value={selectedComponent.id}
                readOnly
                className="input text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom CSS Class
              </label>
              <input
                type="text"
                placeholder="custom-class"
                className="input text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
