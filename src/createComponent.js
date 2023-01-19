export const createComponent = ({ name, model, view, controller }) => {
  const type = 'component'
  const component = {
    [name]: (state) => ({
      type,
      state,
      model,
      view,
      controller
    })
  }
  return component[name]
}
