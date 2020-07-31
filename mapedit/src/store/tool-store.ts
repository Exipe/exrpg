
import { SceneBuilder } from "exrpg"

export interface Tool {
    name: string,
    modes: string[],
    apply: (builder: SceneBuilder, mode: string, x: number, y: number) => void
}

interface ToolEntry {
    tool: Tool,
    mode: string
}

interface ToolState {
    current: string,
    tools: ToolEntry[]
}

// action declarations

interface AddTool {
    type: "ADD_TOOL",
    tool: Tool
}

export function addTool(tool: Tool): AddTool {
    return {
        type: "ADD_TOOL",
        tool: tool
    }
}

interface SelectTool {
    type: "SELECT_TOOL",
    toolName: string
}

export function selectTool(toolName: string): SelectTool {
    return {
        type: "SELECT_TOOL",
        toolName: toolName
    }
}

interface SetToolMode {
    type: "SET_TOOL_MODE",
    toolName: string,
    mode: string
}

export function setToolMode(toolName: string, mode: string): SetToolMode {
    return {
        type: "SET_TOOL_MODE",
        toolName: toolName,
        mode: mode
    }
}

// reducers

function toolEntryReducer(state: ToolEntry, action: SetToolMode) {
    if(state.tool.name != action.toolName) return state
    else return {
        ...state,
        mode: action.mode
    }
}

function toolEntriesReducer(state: ToolEntry[], action: AddTool | SetToolMode) {
    switch(action.type) {
        case "ADD_TOOL":
            const newEntry: ToolEntry = {
                tool: action.tool,
                mode: action.tool.modes[0]
            }

            return [ ...state, newEntry ]

        case "SET_TOOL_MODE":
            return state.map(entry => toolEntryReducer(entry, action))
    }
}

export function toolReducer(state: ToolState = { current: null, tools: [] }, action: AddTool | SelectTool | SetToolMode) {
    switch(action.type) {
        case "ADD_TOOL":
        case "SET_TOOL_MODE":
            return { ...state, tools: toolEntriesReducer(state.tools, action) }
        case "SELECT_TOOL":
            return { ...state, current: action.toolName }
        default: return state
    }
}
