import { COMPONENT_TYPES } from './componentRegistry'
import { useBuilderStore } from '../store/builderStore'

export default function ComponentRenderer({ component, isSelected, onSelect }) {
  const { removeComponent } = useBuilderStore()

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this component?')) {
      removeComponent(component.id)
    }
  }

  const renderComponent = () => {
    const { type, props } = component

    switch (type) {
      case COMPONENT_TYPES.BUTTON:
        return (
          <button
            className={`px-4 py-2 rounded font-medium ${
              props.variant === 'primary'
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : props.variant === 'secondary'
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
            } ${
              props.size === 'small' ? 'text-sm' : props.size === 'large' ? 'text-lg' : ''
            }`}
          >
            {props.text}
          </button>
        )

      case COMPONENT_TYPES.TEXT:
        return (
          <div
            className={`text-${props.fontSize} font-${props.fontWeight} text-${props.color}`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {props.content}
          </div>
        )

      case COMPONENT_TYPES.INPUT:
        return (
          <div className="space-y-1">
            {props.label && (
              <label className="block text-sm font-medium text-gray-700">
                {props.label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <input
              type={props.type}
              placeholder={props.placeholder}
              required={props.required}
              className="input"
            />
          </div>
        )

      case COMPONENT_TYPES.CONTAINER:
        const gapClass = {
          none: 'gap-0',
          small: 'gap-2',
          medium: 'gap-4',
          large: 'gap-8'
        }[props.gap] || 'gap-4'

        const paddingClass = {
          none: 'p-0',
          small: 'p-2',
          medium: 'p-4',
          large: 'p-8'
        }[props.padding] || 'p-4'

        const layoutClass = {
          column: 'flex-col',
          row: 'flex-row',
          grid: 'grid grid-cols-2'
        }[props.layout] || 'flex-col'

        return (
          <div
            className={`flex ${layoutClass} ${gapClass} ${paddingClass} border-2 border-dashed border-gray-300 rounded`}
            style={{ backgroundColor: props.backgroundColor || 'transparent' }}
          >
            <p className="text-sm text-gray-500 italic">
              Container - Add components here
            </p>
          </div>
        )

      case COMPONENT_TYPES.IMAGE:
        return (
          <div className={`${props.width === 'full' ? 'w-full' : 'w-auto'}`}>
            <img
              src={props.src}
              alt={props.alt}
              className={`rounded object-${props.objectFit}`}
            />
          </div>
        )

      case COMPONENT_TYPES.TABLE:
        return (
          <table className={`min-w-full ${props.bordered ? 'border border-gray-300' : ''}`}>
            <thead className="bg-gray-100">
              <tr>
                {props.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={props.striped ? 'bg-gray-50' : ''}>
                {props.columns.map((_, idx) => (
                  <td key={idx} className="px-4 py-2 text-sm text-gray-600 border-b">
                    Sample data
                  </td>
                ))}
              </tr>
              <tr>
                {props.columns.map((_, idx) => (
                  <td key={idx} className="px-4 py-2 text-sm text-gray-600 border-b">
                    Sample data
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )

      case COMPONENT_TYPES.FORM:
        return (
          <form
            className={`space-y-4 border-2 border-dashed border-gray-300 rounded p-4`}
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="text-sm text-gray-500 italic">Form - Add form fields here</p>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {props.submitLabel}
              </button>
              <button type="reset" className="btn btn-secondary">
                {props.resetLabel}
              </button>
            </div>
          </form>
        )

      case COMPONENT_TYPES.CARD:
        const elevationClass = {
          none: 'shadow-none',
          small: 'shadow-sm',
          medium: 'shadow-md',
          large: 'shadow-lg'
        }[props.elevation] || 'shadow-md'

        return (
          <div className={`${elevationClass} rounded-lg overflow-hidden border border-gray-200`}>
            {props.showHeader && (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{props.title}</h3>
              </div>
            )}
            <div className="p-4">
              <p className="text-sm text-gray-500 italic">Card content area</p>
            </div>
            {props.showFooter && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-500">Card footer</p>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="p-4 bg-gray-100 rounded border border-gray-300">
            Unknown component type: {type}
          </div>
        )
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'
      }`}
    >
      {/* Component */}
      <div className="pointer-events-none">{renderComponent()}</div>

      {/* Controls - only show when selected or hovered */}
      {isSelected && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 flex gap-1">
          <button
            onClick={handleDelete}
            className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            title="Delete component"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Component type label */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 transform -translate-x-2 translate-y-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
          {component.type}
        </div>
      )}
    </div>
  )
}
