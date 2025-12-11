// Inspired by react-hot-toast library
import React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

// Internal toast structure (JS version)
function createToastObject(props, id) {
  return {
    id,
    title: props.title,
    description: props.description,
    action: props.action,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismiss(id)
    }
  }
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

let memoryState = { toasts: [] }
const listeners = []

const toastTimeouts = new Map()

function addToRemoveQueue(toastId) {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id))
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (!action.toastId) return { ...state, toasts: [] }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function dismiss(toastId) {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
}

function toast(props) {
  const id = genId()

  const toastObj = createToastObject(props, id)

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: toastObj,
  })

  return {
    id,
    dismiss: () => dismiss(id),
    update: (newProps) =>
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { id, ...newProps },
      }),
  }
}

function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId) => dismiss(toastId),
  }
}

export { useToast, toast }
