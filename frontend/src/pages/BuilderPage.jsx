import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useBuilderStore } from '../store/builderStore'
import { COMPONENT_DEFINITIONS, getComponentsByCategory } from '../builder/componentRegistry'
import ComponentRenderer from '../builder/ComponentRenderer'
import PropertiesPanel from '../builder/PropertiesPanel'

export default function BuilderPage() {
  const { appId } = useParams()
  const [activeCategory, setActiveCategory] = useState('Basic')

  const {
    components,
    selectedComponentId,
    applicationName,
    addComponent,
    selectComponent,
    setApplication,
    exportState,
    importState,
    undo,
    redo
  } = useBuilderStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const componentsByCategory = getComponentsByCategory()

  useEffect(() => {
    if (appId) {
      setApplication(appId, 'My Application')
      // TODO: Load application data from API
    }
  }, [appId, setApplication])

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return

    // If dragging from component library
    if (active.id.startsWith('library-')) {
      const componentType = active.id.replace('library-', '')
      addComponent(componentType)
    }
  }

  const handleAddComponent = (componentType) => {
    addComponent(componentType)
  }

  const handleSave = () => {
    const state = exportState()
    console.log('Saving application:', state)
    // TODO: Save to API
    alert('Application saved!')
  }

  const handlePreview = () => {
    console.log('Preview mode')
    // TODO: Open preview
  }

  const handlePublish = () => {
    console.log('Publishing application')
    // TODO: Publish to production
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Builder Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Visual Builder</h2>
          {applicationName && <span className="text-sm text-gray-500">{applicationName}</span>}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <button onClick={handlePreview} className="btn btn-secondary">
            Preview
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save
          </button>
          <button onClick={handlePublish} className="btn btn-primary">
            Publish
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Builder Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Components Panel */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Components</h3>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(componentsByCategory).map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      activeCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Component Library */}
              <div className="space-y-2">
                {componentsByCategory[activeCategory]?.map(component => (
                  <div
                    key={component.type}
                    onClick={() => handleAddComponent(component.type)}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{component.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{component.label}</div>
                        <div className="text-xs text-gray-500">{component.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-8 overflow-auto bg-gray-50">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg min-h-[800px] p-8">
              {components.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">Visual Builder Canvas</h3>
                  <p>Click on components from the left panel to start building</p>
                  <p className="text-sm mt-4">Your application will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {components.map(component => (
                    <ComponentRenderer
                      key={component.id}
                      component={component}
                      isSelected={selectedComponentId === component.id}
                      onSelect={() => selectComponent(component.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          <PropertiesPanel />
        </div>
      </DndContext>
    </div>
  )
}
