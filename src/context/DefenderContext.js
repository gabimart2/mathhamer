// src/contexts/DefenderContext.js
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'

const initialProfile = {
  toughness: '',
  save: '',
  invulnerableSave: 'N/A',
  fellNoPain: 'N/A',
  wounds: ''
}
const initialState = { profile: initialProfile, numModels: '' }

function defenderReducer (state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } }
    case 'SET_NUM_MODELS':
      return { ...state, numModels: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const StateContext = createContext()
const DispatchContext = createContext()

export function DefenderProvider ({ children }) {
  const [state, dispatch] = useReducer(defenderReducer, initialState)
  const contextValue = useMemo(() => ({ state, dispatch }), [state])
  return (
    <StateContext.Provider value={contextValue.state}>
      <DispatchContext.Provider value={contextValue.dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useDefender () {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const setProfile = useCallback(
    profile => dispatch({ type: 'SET_PROFILE', payload: profile }),
    [dispatch]
  )
  const updateProfile = useCallback(
    updates => dispatch({ type: 'UPDATE_PROFILE', payload: updates }),
    [dispatch]
  )
  const setNumModels = useCallback(
    num => dispatch({ type: 'SET_NUM_MODELS', payload: num }),
    [dispatch]
  )
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [dispatch])
  const defender = { profile: state.profile, numModels: state.numModels }
  return { defender, setProfile, updateProfile, setNumModels, reset }
}
