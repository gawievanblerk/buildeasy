import { create } from 'zustand';
import { createComponentInstance } from '../builder/componentRegistry';

export const useBuilderStore = create((set, get) => ({
  // Canvas state
  components: [],
  selectedComponentId: null,
  hoveredComponentId: null,

  // Application being edited
  applicationId: null,
  applicationName: '',

  // History for undo/redo
  history: [],
  historyIndex: -1,

  // UI state
  showGrid: true,
  snapToGrid: true,
  zoom: 1,

  // Set application being edited
  setApplication: (id, name) => {
    set({ applicationId: id, applicationName: name });
  },

  // Component management
  addComponent: (type, props = {}) => {
    const newComponent = createComponentInstance(type, props);

    set(state => {
      const newComponents = [...state.components, newComponent];
      return {
        components: newComponents,
        selectedComponentId: newComponent.id
      };
    });

    get().pushHistory();
  },

  removeComponent: (componentId) => {
    set(state => ({
      components: state.components.filter(c => c.id !== componentId),
      selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId
    }));

    get().pushHistory();
  },

  updateComponent: (componentId, updates) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === componentId
          ? { ...c, ...updates }
          : c
      )
    }));

    get().pushHistory();
  },

  updateComponentProps: (componentId, propUpdates) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === componentId
          ? { ...c, props: { ...c.props, ...propUpdates } }
          : c
      )
    }));

    get().pushHistory();
  },

  updateComponentStyles: (componentId, styleUpdates) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === componentId
          ? { ...c, styles: { ...c.styles, ...styleUpdates } }
          : c
      )
    }));

    get().pushHistory();
  },

  moveComponent: (componentId, newPosition) => {
    set(state => ({
      components: state.components.map(c =>
        c.id === componentId
          ? { ...c, position: newPosition }
          : c
      )
    }));
  },

  // Selection
  selectComponent: (componentId) => {
    set({ selectedComponentId: componentId });
  },

  deselectComponent: () => {
    set({ selectedComponentId: null });
  },

  // Hover
  setHoveredComponent: (componentId) => {
    set({ hoveredComponentId: componentId });
  },

  clearHoveredComponent: () => {
    set({ hoveredComponentId: null });
  },

  // History management
  pushHistory: () => {
    set(state => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        components: JSON.parse(JSON.stringify(state.components)),
        timestamp: Date.now()
      });

      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },

  undo: () => {
    const { history, historyIndex } = get();

    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        components: JSON.parse(JSON.stringify(previousState.components)),
        historyIndex: historyIndex - 1
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();

    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        components: JSON.parse(JSON.stringify(nextState.components)),
        historyIndex: historyIndex + 1
      });
    }
  },

  // Canvas settings
  toggleGrid: () => {
    set(state => ({ showGrid: !state.showGrid }));
  },

  toggleSnapToGrid: () => {
    set(state => ({ snapToGrid: !state.snapToGrid }));
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(0.25, Math.min(2, zoom)) });
  },

  zoomIn: () => {
    const { zoom } = get();
    get().setZoom(zoom + 0.1);
  },

  zoomOut: () => {
    const { zoom } = get();
    get().setZoom(zoom - 0.1);
  },

  resetZoom: () => {
    set({ zoom: 1 });
  },

  // Load/Save
  loadComponents: (components) => {
    set({
      components,
      selectedComponentId: null,
      history: [{ components: JSON.parse(JSON.stringify(components)), timestamp: Date.now() }],
      historyIndex: 0
    });
  },

  clearCanvas: () => {
    set({
      components: [],
      selectedComponentId: null,
      hoveredComponentId: null,
      history: [],
      historyIndex: -1
    });
  },

  // Export canvas state
  exportState: () => {
    const { components, applicationId, applicationName } = get();
    return {
      applicationId,
      applicationName,
      components,
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    };
  },

  // Import canvas state
  importState: (state) => {
    if (state.components && Array.isArray(state.components)) {
      get().loadComponents(state.components);
      if (state.applicationId) {
        set({
          applicationId: state.applicationId,
          applicationName: state.applicationName || ''
        });
      }
    }
  },

  // Get selected component
  getSelectedComponent: () => {
    const { components, selectedComponentId } = get();
    return components.find(c => c.id === selectedComponentId) || null;
  },

  // Get component by ID
  getComponent: (componentId) => {
    const { components } = get();
    return components.find(c => c.id === componentId) || null;
  }
}));
